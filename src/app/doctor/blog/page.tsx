"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  status: "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "REJECTED";
  category: string;
  rejectionReason: string | null;
  createdAt: string;
}

const statusStyles: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  PENDING_REVIEW: "bg-yellow-100 text-yellow-800",
  PUBLISHED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-700",
};

export default function DoctorBlogListPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/doctor/blog")
      .then((res) => res.json())
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Articles</h1>
        <Link
          href="/doctor/blog/new"
          className="bg-teal-950 text-white px-5 py-2 rounded-lg text-sm hover:bg-teal-900"
        >
          + Write Article
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">You haven't written any articles yet.</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/doctor/blog/${post.id}`}
              className="border rounded-xl p-4 flex items-center justify-between bg-white hover:shadow-md transition-shadow"
            >
              <div>
                <p className="font-medium">{post.title}</p>
                <p className="text-sm text-gray-500">{post.category}</p>
                {post.status === "REJECTED" && post.rejectionReason && (
                  <p className="text-xs text-red-600 mt-1">Reason: {post.rejectionReason}</p>
                )}
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyles[post.status]}`}>
                {post.status.replace("_", " ")}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}