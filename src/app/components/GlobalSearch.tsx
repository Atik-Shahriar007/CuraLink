"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

interface GlobalSearchResult {
  type: "doctor" | "medicine" | "consultation" | "patient";
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GlobalSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleSearch(q: string) {
    setQuery(q);
    if (q.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    setOpen(true);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }

  const typeColors: Record<string, string> = {
    doctor: "bg-teal-100 text-teal-800",
    medicine: "bg-orange-100 text-orange-800",
    patient: "bg-blue-100 text-blue-800",
    consultation: "bg-purple-100 text-purple-800",
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 border border-stone-200 rounded-xl px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-400 transition">
        <Search size={16} className="text-stone-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search doctors, medicines..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="outline-none text-sm text-stone-700 placeholder-stone-400 w-48 md:w-64 bg-transparent"
        />
        {query && (
          <button onClick={() => { setQuery(""); setResults([]); setOpen(false); }}>
            <X size={14} className="text-stone-400 hover:text-stone-600" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute top-12 left-0 w-80 bg-white border border-stone-200 rounded-2xl shadow-xl z-50 overflow-hidden">
          {loading ? (
            <div className="p-4 text-center text-stone-400 text-sm">Searching...</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-stone-400 text-sm">No results for &ldquo;{query}&rdquo;</div>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              {results.map((r) => (
                <a
                  key={r.id}
                  href={r.href}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors border-b border-stone-50 last:border-0"
                  onClick={() => { setOpen(false); setQuery(""); }}
                >
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[r.type] || "bg-stone-100 text-stone-600"}`}>
                    {r.type}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-stone-800 truncate">{r.title}</p>
                    <p className="text-xs text-stone-500 truncate">{r.subtitle}</p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
