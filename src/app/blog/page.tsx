"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  category: string;
  coverImageUrl: string | null;
  readTimeMinutes: number;
  publishedAt: string;
  doctor: { account: { firstName: string | null; lastName: string | null } };
}

const CATEGORIES = [
  "All", "General Health", "Mental Health", "Child Health", "Nutrition & Diet",
  "Heart Health", "Women's Health", "Skin Care", "Diabetes & Endocrine Health",
  "Elderly Care", "Preventive Care & Wellness",
];

export default function BlogListPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "All") params.set("category", category);

    const res = await fetch(`/api/blog?${params.toString()}`);
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  }, [category]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 font-display">Health Articles</h1>
      <p className="text-gray-500 mb-6">Written by CuraLink doctors.</p>

      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === c
                ? "bg-teal-950 text-white"
                : "bg-stone-100 hover:bg-stone-200 text-gray-700"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading articles...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">No articles in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white"
            >
              <div className="w-full h-44 bg-gray-100">
                {post.coverImageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.coverImageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <span className="text-xs text-[var(--color-copper)] font-medium">{post.category}</span>
                <h2 className="font-semibold text-lg mt-1 leading-snug">{post.title}</h2>
                {post.excerpt && (
                  <p className="text-gray-500 text-sm mt-2 line-clamp-2">{post.excerpt}</p>
                )}
                <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
                  <span>
                    Dr. {post.doctor.account.firstName} {post.doctor.account.lastName}
                  </span>
                  <span>{post.readTimeMinutes} min read</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}