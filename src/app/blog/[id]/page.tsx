"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  coverImageUrl: string | null;
  readTimeMinutes: number;
  publishedAt: string;
  doctor: { account: { firstName: string | null; lastName: string | null } };
}

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/blog/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(setPost)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="max-w-3xl mx-auto px-4 py-8">Loading...</p>;
  if (notFound || !post) return <p className="max-w-3xl mx-auto px-4 py-8">Article not found.</p>;

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <span className="text-xs text-[var(--color-copper)] font-medium">{post.category}</span>
      <h1 className="text-3xl font-bold font-display mt-2 mb-3">{post.title}</h1>
      <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
        <span>
          By Dr. {post.doctor.account.firstName} {post.doctor.account.lastName}
        </span>
        <span>·</span>
        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
        <span>·</span>
        <span>{post.readTimeMinutes} min read</span>
      </div>

      {post.coverImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImageUrl}
          alt={post.title}
          className="w-full h-72 object-cover rounded-xl mb-8"
        />
      )}

      <div className="prose prose-stone max-w-none whitespace-pre-wrap text-gray-800 leading-relaxed">
        {post.content}
      </div>
    </article>
  );
}