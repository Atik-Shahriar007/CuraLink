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
  const hasStartedRef = useRef(false); // guards against Strict Mode double-invoke

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

    if (hasStartedRef.current) return; // already started once, skip the duplicate effect run
    hasStartedRef.current = true;

    const accountRole = account.role;

    async function join() {
      setStatus("joining");
      console.log("[room] fetching token...");

      try {
        const res = await fetch(`/api/consultations/${id}/room-token`, {
          method: "POST",
        });
        const data = await res.json();
        console.log("[room] token response:", res.status, data.roomName);

        if (!res.ok) {
          setErrorMsg(data.error || "Could not join consultation");
          setStatus("error");
          return;
        }

        if (!containerRef.current) {
          console.log("[room] container not ready");
          return;
        }

        console.log("[room] creating call frame...");
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

        callFrame.on("error", (e) => {
          console.error("[room] daily error event:", e);
        });

        console.log("[room] calling join()...");
        await callFrame.join({
          url: `https://${data.dailyDomain}.daily.co/${data.roomName}`,
          token: data.token,
        });
        console.log("[room] join() resolved successfully");

        setStatus("in-call");
      } catch (err: any) {
        console.error(
          "[room] Join error:",
          err?.errorMsg || err?.message || JSON.stringify(err) || err
        );
        setErrorMsg("Something went wrong joining the call");
        setStatus("error");
      }
    }

    join();
  }, [id, account, authLoading, router]);

  // Separate cleanup on actual unmount only
  useEffect(() => {
    return () => {
      callFrameRef.current?.destroy();
      callFrameRef.current = null;
    };
  }, []);

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
    <div className="relative flex flex-col h-screen">
      <div ref={containerRef} className="flex-1" />

      {(status === "loading" || status === "joining") && (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <p className="text-gray-500">Joining consultation...</p>
        </div>
      )}
    </div>
  );
}