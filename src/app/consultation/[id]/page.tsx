"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DailyIframe, { DailyCall } from "@daily-co/daily-js";
import { useAuth } from "@/lib/AuthContext";
import { getPusherClient } from "@/lib/pusherClient";

interface ChatMessage {
  text: string;
  senderName: string;
  senderRole: "DOCTOR" | "PATIENT" | "ADMIN";
  timestamp: string;
}

export default function ConsultationRoomPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { account, loading: authLoading } = useAuth();

  const callFrameRef = useRef<DailyCall | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasStartedRef = useRef(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [status, setStatus] = useState<"loading" | "joining" | "in-call" | "error">(
    "loading"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [sending, setSending] = useState(false);

  // Video join logic
  useEffect(() => {
    if (authLoading) return;
    if (!account) {
      router.push("/login");
      return;
    }

    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const accountRole = account.role;

    async function join() {
      setStatus("joining");

      try {
        const res = await fetch(`/api/consultations/${id}/room-token`, {
          method: "POST",
        });
        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(data.error || "Could not join consultation");
          setStatus("error");
          return;
        }

        if (!containerRef.current) return;

        const callFrame = DailyIframe.createFrame(containerRef.current, {
          iframeStyle: {
            width: "100%",
            height: "100%",
            border: "0",
          },
          showLeaveButton: true,
        });

        callFrameRef.current = callFrame;

        callFrame.on("left-meeting", () => {
          router.push(
            accountRole === "DOCTOR"
              ? "/doctor/consultations"
              : "/patient/consultations"
          );
        });

        await callFrame.join({
          url: `https://${data.dailyDomain}.daily.co/${data.roomName}`,
          token: data.token,
        });

        setStatus("in-call");
      } catch (err: any) {
        console.error("Join error:", err?.errorMsg || err?.message || err);
        setErrorMsg("Something went wrong joining the call");
        setStatus("error");
      }
    }

    join();
  }, [id, account, authLoading, router]);

  useEffect(() => {
    return () => {
      callFrameRef.current?.destroy();
      callFrameRef.current = null;
    };
  }, []);

  // Pusher chat subscription
  useEffect(() => {
    if (!account) return;

    const pusher = getPusherClient();
    const channel = pusher.subscribe(`consultation-${id}`);

    channel.bind("new-message", (data: ChatMessage) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`consultation-${id}`);
    };
  }, [id, account]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!chatInput.trim() || sending) return;

    setSending(true);
    const text = chatInput;
    setChatInput("");

    try {
      await fetch(`/api/consultations/${id}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
    } catch (err) {
      console.error("Send message error:", err);
    } finally {
      setSending(false);
    }
  }

  if (status === "error") {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-red-600 mb-4">{errorMsg}</p>
        <button onClick={() => router.back()} className="text-blue-600 hover:underline">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="relative flex-1 flex flex-col">
        <div ref={containerRef} className="flex-1" />
        {(status === "loading" || status === "joining") && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <p className="text-gray-500">Joining consultation...</p>
          </div>
        )}
      </div>

      <div className="w-80 border-l flex flex-col bg-white text-gray-900">
        <div className="px-4 py-3 border-b font-semibold">Chat</div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.length === 0 && (
            <p className="text-sm text-gray-400">No messages yet.</p>
          )}
          {messages.map((m, i) => (
            <div key={i}>
              <p className="text-xs text-gray-500">
                {m.senderName} · {new Date(m.timestamp).toLocaleTimeString()}
              </p>
              <p className="text-sm bg-gray-100 text-gray-900 rounded-lg px-3 py-2 mt-1 inline-block">
                {m.text}
              </p>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="border-t p-3 flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-lg px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={sending || !chatInput.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}