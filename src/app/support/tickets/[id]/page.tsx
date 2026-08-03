"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { getPusherClient } from "@/lib/pusherClient";

interface Message {
  id: string;
  body: string;
  createdAt: string;
  sender: { firstName: string | null; lastName: string | null; role: string };
}

interface Ticket {
  id: string;
  ticketNumber: number;
  subject: string;
  category: string;
  status: string;
  createdBy: { firstName: string | null; lastName: string | null; role: string };
  messages: Message[];
}

const statusStyles: Record<string, string> = {
  OPEN: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  RESOLVED: "bg-emerald-100 text-emerald-800",
  CLOSED: "bg-gray-100 text-gray-700",
};

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { account } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isStaff = account?.role === "SUPPORT_AGENT" || account?.role === "ADMIN";

  function fetchTicket() {
    fetch(`/api/support/tickets/${id}`)
      .then((res) => res.json())
      .then(setTicket)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchTicket();
  }, [id]);

  useEffect(() => {
    const pusher = getPusherClient();
    const channel = pusher.subscribe(`support-ticket-${id}`);
    channel.bind("new-message", () => fetchTicket());
    channel.bind("status-update", () => fetchTicket());
    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`support-ticket-${id}`);
    };
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages.length]);

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    try {
      await fetch(`/api/support/tickets/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: reply }),
      });
      setReply("");
      fetchTicket();
    } finally {
      setSending(false);
    }
  }

  async function handleStatusChange(status: string) {
    await fetch(`/api/support/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchTicket();
  }

  if (loading) return <p className="max-w-2xl mx-auto px-4 py-8">Loading...</p>;
  if (!ticket) return <p className="max-w-2xl mx-auto px-4 py-8">Ticket not found.</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <p className="text-xs text-gray-400 font-mono mb-1">TKT-{1000 + ticket.ticketNumber}</p>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold">{ticket.subject}</h1>
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyles[ticket.status]}`}>
          {ticket.status.replace("_", " ")}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-6">{ticket.category.replace(/_/g, " ")}</p>

      {isStaff && (
        <div className="flex gap-2 mb-6">
          {["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              disabled={ticket.status === s}
              className="text-xs border rounded-full px-3 py-1 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-default"
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-4 mb-6">
        {ticket.messages.map((m) => {
          const isMine = m.sender.role === account?.role && m.sender.firstName === account?.firstName;
          const isFromStaff = m.sender.role === "SUPPORT_AGENT" || m.sender.role === "ADMIN";
          return (
            <div key={m.id} className={`flex ${isFromStaff ? "justify-start" : "justify-end"}`}>
              <div className={`max-w-[75%] rounded-xl px-4 py-2.5 ${isFromStaff ? "bg-gray-100 text-gray-900" : "bg-teal-950 text-white"}`}>
                <p className="text-xs opacity-70 mb-1">
                  {m.sender.firstName} {m.sender.lastName} {isFromStaff && "(Support)"}
                </p>
                <p className="text-sm whitespace-pre-wrap">{m.body}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {ticket.status !== "CLOSED" && (
        <form onSubmit={handleReply} className="flex gap-2">
          <input
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type a reply..."
            className="flex-1 border rounded-lg px-4 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={sending}
            className="bg-teal-950 text-white px-5 py-2 rounded-lg text-sm hover:bg-teal-900 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
}