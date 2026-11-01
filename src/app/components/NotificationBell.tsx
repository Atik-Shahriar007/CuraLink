"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck, X, Info, AlertTriangle, CheckCircle } from "lucide-react";

interface Notification {
  id: string;
  type: "info" | "warning" | "success" | "error";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  href?: string;
}

const typeIcon = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  error: X,
};

const typeColor = {
  info: "text-blue-600 bg-blue-50",
  warning: "text-amber-600 bg-amber-50",
  success: "text-green-600 bg-green-50",
  error: "text-red-600 bg-red-50",
};

// Local notification store using localStorage
function getNotifications(): Notification[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("curalink_notifications") || "[]");
  } catch {
    return [];
  }
}

function saveNotifications(notifs: Notification[]) {
  localStorage.setItem("curalink_notifications", JSON.stringify(notifs));
}

export function addNotification(notif: Omit<Notification, "id" | "read" | "createdAt">) {
  const existing = getNotifications();
  const newNotif: Notification = {
    ...notif,
    id: Date.now().toString(),
    read: false,
    createdAt: new Date().toISOString(),
  };
  saveNotifications([newNotif, ...existing].slice(0, 50));
  window.dispatchEvent(new Event("notifications-updated"));
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  function refresh() {
    setNotifications(getNotifications());
  }

  useEffect(() => {
    refresh();
    window.addEventListener("notifications-updated", refresh);
    return () => window.removeEventListener("notifications-updated", refresh);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
    setNotifications(updated);
  }

  function dismiss(id: string) {
    const updated = notifications.filter((n) => n.id !== id);
    saveNotifications(updated);
    setNotifications(updated);
  }

  function markRead(id: string) {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveNotifications(updated);
    setNotifications(updated);
  }

  function formatTime(iso: string) {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return d.toLocaleDateString();
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => { setOpen(!open); if (!open) refresh(); }}
        className="relative p-2 rounded-lg hover:bg-stone-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={20} className="text-stone-600" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-80 bg-white border border-stone-200 rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
            <h3 className="font-semibold text-stone-800 text-sm">Notifications</h3>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-teal-700 hover:text-teal-900 flex items-center gap-1"
              >
                <CheckCheck size={12} />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-stone-400">
                <Bell size={24} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => {
                const Icon = typeIcon[n.type];
                return (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-b border-stone-50 hover:bg-stone-50 transition-colors ${
                      !n.read ? "bg-teal-50/30" : ""
                    }`}
                    onClick={() => markRead(n.id)}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`p-1 rounded-full mt-0.5 ${typeColor[n.type]}`}>
                        <Icon size={12} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-800 truncate">{n.title}</p>
                        <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-xs text-stone-400 mt-1">{formatTime(n.createdAt)}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                        className="text-stone-300 hover:text-stone-500 flex-shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    {!n.read && (
                      <div className="w-2 h-2 bg-teal-500 rounded-full absolute right-4 mt-1" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-stone-100">
              <button
                onClick={() => { saveNotifications([]); setNotifications([]); }}
                className="text-xs text-stone-400 hover:text-red-500 transition-colors"
              >
                Clear all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
