"use client";

import { useState, useEffect } from "react";

interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  category: string;
  status: "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "REJECTED";
  coverImageUrl: string | null;
  createdAt: string;
  doctor: { account: { firstName: string | null; lastName: string | null } };
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  function fetchPosts() {
    setLoading(true);
    fetch("/api/admin/blog")
      .then((res) => res.json())
      .then(setPosts)
      .finally(() => setLoading(false));
  }

  useEffect(fetchPosts, []);

  async function handlePublish(id: string) {
    setBusyId(id);
    await fetch(`/api/admin/blog/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "PUBLISH" }),
    });
    fetchPosts();
    setBusyId(null);
  }

  async function handleReject(id: string) {
    const reason = prompt("Reason for rejection (shown to the doctor):");
    if (reason === null) return;
    setBusyId(id);
    await fetch(`/api/admin/blog/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "REJECT", rejectionReason: reason }),
    });
    fetchPosts();
    setBusyId(null);
  }

  const pending = posts.filter((p) => p.status === "PENDING_REVIEW");
  const others = posts.filter((p) => p.status !== "PENDING_REVIEW" && p.status !== "DRAFT");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Article Review</h1>

      <h2 className="text-lg font-semibold mb-3">Pending Review ({pending.length})</h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : pending.length === 0 ? (
        <p className="text-gray-500 mb-8">No articles awaiting review.</p>
      ) : (
        <div className="space-y-4 mb-8">
          {pending.map((post) => (
            <div key={post.id} className="border rounded-xl p-4 bg-white">
              <div className="flex gap-4">
                {post.coverImageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.coverImageUrl} alt="" className="w-32 h-24 object-cover rounded-lg flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="font-medium">{post.title}</p>
                  <p className="text-sm text-gray-500">
                    {post.category} · by Dr. {post.doctor.account.firstName} {post.doctor.account.lastName}
                  </p>
                  {post.excerpt && <p className="text-sm text-gray-600 mt-1">{post.excerpt}</p>}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handlePublish(post.id)}
                      disabled={busyId === post.id}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
                    >
                      Publish
                    </button>
                    <button
                      onClick={() => handleReject(post.id)}
                      disabled={busyId === post.id}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-lg font-semibold mb-3">Reviewed Articles</h2>
      {others.length === 0 ? (
        <p className="text-gray-500">No reviewed articles yet.</p>
      ) : (
        <div className="space-y-2">
          {others.map((post) => (
            <div key={post.id} className="border rounded-lg p-3 flex items-center justify-between bg-white">
              <div>
                <p className="text-sm font-medium">{post.title}</p>
                <p className="text-xs text-gray-500">
                  by Dr. {post.doctor.account.firstName} {post.doctor.account.lastName}
                </p>
              </div>
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  post.status === "PUBLISHED"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {post.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}