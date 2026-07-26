"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DailyIframe, { DailyCall } from "@daily-co/daily-js";
import { useAuth } from "@/lib/AuthContext";

export default function ConsultationRoomPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { account, loading: authLoading } = useAuth();

  const callFrameRef = useRef<DailyCall | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [status, setStatus] = useState<"loading" | "joining" | "in-call" | "error">(
    "loading"
  );
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!account) {
      router.push("/login");
      return;
    }

    let cancelled = false;
    const accountRole = account.role; // captured now, safe to use in later callbacks

    async function join() {
      setStatus("joining");

      try {
        const res = await fetch(`/api/consultations/${id}/room-token`, {
          method: "POST",
        });
        const data = await res.json();

        if (!res.ok) {
          if (!cancelled) {
            setErrorMsg(data.error || "Could not join consultation");
            setStatus("error");
          }
          return;
        }

        if (cancelled || !containerRef.current) return;

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

        if (!cancelled) setStatus("in-call");
      } catch (err) {
        console.error("Join error:", err);
        if (!cancelled) {
          setErrorMsg("Something went wrong joining the call");
          setStatus("error");
        }
      }
    }

    join();

    return () => {
      cancelled = true;
      callFrameRef.current?.destroy();
    };
  }, [id, account, authLoading, router]);

  if (status === "error") {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-red-600 mb-4">{errorMsg}</p>
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {(status === "loading" || status === "joining") && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Joining consultation...</p>
        </div>
      )}
      <div
        ref={containerRef}
        className={status === "in-call" ? "flex-1" : "hidden"}
      />
    </div>
  );
}