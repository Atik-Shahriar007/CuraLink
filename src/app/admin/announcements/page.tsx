"use client";

import { useState, useEffect } from "react";
import { Megaphone, Trash2, Plus, Bell, X, CheckCircle } from "lucide-react";

type AnnouncementType = "info" | "warning" | "success";
type TargetRole = "ALL" | "DOCTOR" | "PATIENT" | "AMBULANCE_PROVIDER";

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: AnnouncementType;
  targetRole: TargetRole;
  createdAt: string;
}

const TYPE_STYLES: Record<AnnouncementType, { badge: string; border: string; icon: string }> = {
  info: {
    badge: "bg-blue-100 text-blue-700",
    border: "border-l-blue-500",
    icon: "🔵",
  },
  warning: {
    badge: "bg-amber-100 text-amber-700",
    border: "border-l-amber-500",
    icon: "🟡",
  },
  success: {
    badge: "bg-emerald-100 text-emerald-700",
    border: "border-l-emerald-500",
    icon: "🟢",
  },
};

const ROLE_LABELS: Record<TargetRole, string> = {
  ALL: "Everyone",
  DOCTOR: "Doctors",
  PATIENT: "Patients",
  AMBULANCE_PROVIDER: "Ambulance Providers",
};

const LS_KEY = "curalink_announcements";

function loadFromStorage(): Announcement[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: Announcement[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<AnnouncementType>("info");
  const [targetRole, setTargetRole] = useState<TargetRole>("ALL");

  useEffect(() => {
    setAnnouncements(loadFromStorage());
  }, []);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title: title.trim(),
      message: message.trim(),
      type,
      targetRole,
      createdAt: new Date().toISOString(),
    };

    const updated = [newAnnouncement, ...announcements];
    setAnnouncements(updated);
    saveToStorage(updated);

    setTitle("");
    setMessage("");
    setType("info");
    setTargetRole("ALL");
    setShowForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleDelete(id: string) {
    const updated = announcements.filter((a) => a.id !== id);
    setAnnouncements(updated);
    saveToStorage(updated);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-teal-100 p-2.5 rounded-xl">
            <Megaphone className="text-teal-800" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Announcements</h1>
            <p className="text-stone-500 text-sm mt-0.5">Broadcast messages to platform users</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "New Announcement"}
        </button>
      </div>

      {/* Success toast */}
      {saved && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl mb-5 text-sm">
          <CheckCircle size={16} />
          Announcement published successfully!
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
            <Bell size={18} className="text-teal-700" />
            Create New Announcement
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Announcement title..."
                required
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your announcement message..."
                required
                rows={4}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as AnnouncementType)}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="info">ℹ️ Info</option>
                  <option value="warning">⚠️ Warning</option>
                  <option value="success">✅ Success</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Target Audience</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value as TargetRole)}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="ALL">Everyone</option>
                  <option value="DOCTOR">Doctors only</option>
                  <option value="PATIENT">Patients only</option>
                  <option value="AMBULANCE_PROVIDER">Ambulance Providers only</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Megaphone size={15} />
                Publish Announcement
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Announcements list */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-semibold text-stone-800">Past Announcements</h2>
          <span className="text-sm text-stone-500">{announcements.length} total</span>
        </div>

        {announcements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-stone-400">
            <Megaphone size={40} className="mb-3 opacity-40" />
            <p className="font-medium">No announcements yet</p>
            <p className="text-sm mt-1">Create your first announcement above</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {announcements.map((ann) => {
              const styles = TYPE_STYLES[ann.type];
              return (
                <div
                  key={ann.id}
                  className={`px-6 py-4 border-l-4 ${styles.border} hover:bg-stone-50 transition-colors`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-stone-800 text-sm">{ann.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles.badge}`}>
                          {styles.icon} {ann.type.charAt(0).toUpperCase() + ann.type.slice(1)}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium">
                          👥 {ROLE_LABELS[ann.targetRole]}
                        </span>
                      </div>
                      <p className="text-stone-600 text-sm mt-1 leading-relaxed">{ann.message}</p>
                      <p className="text-xs text-stone-400 mt-2">
                        {new Date(ann.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(ann.id)}
                      className="text-stone-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                      title="Delete announcement"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
