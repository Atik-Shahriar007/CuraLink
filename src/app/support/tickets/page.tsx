"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

interface Ticket {
  id: string;
  ticketNumber: number;
  subject: string;
  category: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  createdBy: { firstName: string | null; lastName: string | null; role: string };
  messages: { body: string; createdAt: string }[];
  updatedAt: string;
}

const statusStyles: Record<string, string> = {
  OPEN: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  RESOLVED: "bg-emerald-100 text-emerald-800",
  CLOSED: "bg-gray-100 text-gray-700",
};

export default function TicketListPage() {
  const { account } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const isStaff = account?.role === "SUPPORT_AGENT" || account?.role === "ADMIN";

  useEffect(() => {
    fetch("/api/support/tickets")
      .then((res) => res.json())
      .then(setTickets)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{isStaff ? "Support Queue" : "My Support Tickets"}</h1>
        {!isStaff && (
          <Link href="/support/tickets/new" className="bg-teal-950 text-white px-5 py-2 rounded-lg text-sm hover:bg-teal-900">
            + New Ticket
          </Link>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : tickets.length === 0 ? (
        <p className="text-gray-500">No tickets yet.</p>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <Link
              key={t.id}
              href={`/support/tickets/${t.id}`}
              className="border rounded-xl p-4 flex items-center justify-between bg-white hover:shadow-md transition-shadow"
            >
              <div>
                <p className="text-xs text-gray-400 font-mono">TKT-{1000 + t.ticketNumber}</p>
                <p className="font-medium">{t.subject}</p>
                <p className="text-sm text-gray-500">
                  {t.category.replace(/_/g, " ")}
                  {isStaff && ` · ${t.createdBy.firstName} ${t.createdBy.lastName} (${t.createdBy.role})`}
                </p>
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyles[t.status]}`}>
                {t.status.replace("_", " ")}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}