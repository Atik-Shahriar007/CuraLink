"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, ShieldAlert } from "lucide-react";

interface Medicine {
  id: string;
  brandName: string;
  genericName: string;
  form: string;
  therapeuticCategory: string;
  manufacturer: string;
  strength: string;
  unit: string;
  price: number;
  prescriptionRequired: boolean;
  imageUrl: string | null;
}

function MedicinesContent() {
  const searchParams = useSearchParams();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageInput, setPageInput] = useState("");

  const [formOptions, setFormOptions] = useState<string[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);

  // Filter options come from the data, not a hardcoded list.
  useEffect(() => {
    fetch("/api/medicines/filters")
      .then((res) => res.json())
      .then((data) => {
        setFormOptions(Array.isArray(data.forms) ? data.forms : []);
        setCategoryOptions(
          Array.isArray(data.categories) ? data.categories : []
        );
      })
      .catch(() => {});
  }, []);

  // Changing any filter puts us back on page one. Done in the handlers rather
  // than an effect so there is no extra render pass.
  function applyFilter(setter: (value: string) => void) {
    return (value: string) => {
      setter(value);
      setPage(1);
    };
  }

  const onSearch = applyFilter(setSearch);
  const onForm = applyFilter(setForm);
  const onCategory = applyFilter(setCategory);
  const onMinPrice = applyFilter(setMinPrice);
  const onMaxPrice = applyFilter(setMaxPrice);

  const fetchMedicines = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (form) params.set("form", form);
    if (category) params.set("category", category);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    params.set("page", String(page));

    try {
      const res = await fetch(`/api/medicines?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || !Array.isArray(data.items)) {
        setMedicines([]);
        setTotal(0);
        setTotalPages(1);
        setError(data?.error || "Could not load medicines.");
        return;
      }

      setMedicines(data.items);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      setMedicines([]);
      setTotal(0);
      setTotalPages(1);
      setError("Could not load medicines.");
    } finally {
      setLoading(false);
    }
  }, [search, form, category, minPrice, maxPrice, page]);

  useEffect(() => {
    const timeout = setTimeout(fetchMedicines, 300);
    return () => clearTimeout(timeout);
  }, [fetchMedicines]);

  // Compact page list around the current page, e.g. 1 ... 41 42 43 ... 86
  const pageNumbers = useMemo(() => {
    const pages: (number | null)[] = [];
    let last = 0;

    for (let p = 1; p <= totalPages; p++) {
      const nearCurrent = Math.abs(p - page) <= 1;
      if (p === 1 || p === totalPages || nearCurrent) {
        if (last && p - last > 1) pages.push(null);
        pages.push(p);
        last = p;
      }
    }

    return pages;
  }, [page, totalPages]);

  // Lets you type a page number instead of clicking Next 50 times.
  function goToTypedPage() {
    const n = Number.parseInt(pageInput, 10);
    if (!Number.isFinite(n)) return;
    setPage(Math.min(Math.max(n, 1), totalPages));
    setPageInput("");
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-display mb-2">Medicine Directory</h1>
      <p className="text-stone-500 mb-8">
        Search by brand or generic name, and filter by form, category, or price.
      </p>

      <div className="bg-white border border-stone-200 rounded-2xl p-4 mb-10 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
          />
          <input
            type="text"
            placeholder="Search by brand or generic name..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full border border-stone-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900/10"
          />
        </div>
        <select
          value={form}
          onChange={(e) => onForm(e.target.value)}
          className="border border-stone-200 rounded-lg px-3 py-2.5 text-sm"
        >
          <option value="">All Forms</option>
          {formOptions.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        <select
          value={category}
          onChange={(e) => onCategory(e.target.value)}
          className="border border-stone-200 rounded-lg px-3 py-2.5 text-sm"
        >
          <option value="">All Categories</option>
          {categoryOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => onMinPrice(e.target.value)}
          className="w-28 border border-stone-200 rounded-lg px-3 py-2.5 text-sm"
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => onMaxPrice(e.target.value)}
          className="w-28 border border-stone-200 rounded-lg px-3 py-2.5 text-sm"
        />
      </div>

      {loading ? (
        <p className="text-stone-400">Loading medicines...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : medicines.length === 0 ? (
        <p className="text-stone-400">No medicines found matching your criteria.</p>
      ) : (
        <>
        <p className="text-sm text-stone-500 mb-4">
          {total} medicine{total === 1 ? "" : "s"} found · page {page} of{" "}
          {totalPages}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map((med) => (
            <Link
              key={med.id}
              href={`/medicines/${med.id}`}
              className="group border border-stone-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-teal-800/30 transition-all bg-white"
            >
              <div className="w-full h-40 bg-stone-100">
                {med.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={med.imageUrl}
                    alt={med.brandName}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <h2 className="font-semibold group-hover:text-teal-900 transition-colors">{med.brandName}</h2>
                <p className="text-stone-500 text-sm">{med.genericName} · {med.strength}</p>
                <p className="text-stone-400 text-xs mt-1">{med.form} · {med.therapeuticCategory}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
                  <span className="text-[var(--color-copper)] font-semibold">
                    ৳{med.price.toFixed(2)} <span className="text-xs text-stone-400 font-normal">{med.unit}</span>
                  </span>
                  {med.prescriptionRequired && (
                    <span className="flex items-center gap-1 text-xs bg-red-50 text-red-700 px-2 py-1 rounded-full">
                      <ShieldAlert size={11} /> Rx
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="border border-stone-200 rounded-lg px-4 py-2 text-sm disabled:opacity-40 hover:bg-stone-50"
            >
              Previous
            </button>

            {pageNumbers.map((p, i) =>
              p === null ? (
                <span key={`gap-${i}`} className="px-2 text-stone-400">
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`border rounded-lg px-4 py-2 text-sm ${
                    p === page
                      ? "bg-teal-950 text-white border-teal-950"
                      : "border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="border border-stone-200 rounded-lg px-4 py-2 text-sm disabled:opacity-40 hover:bg-stone-50"
            >
              Next
            </button>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                goToTypedPage();
              }}
              className="flex items-center gap-2 ml-2"
            >
              <label htmlFor="page-jump" className="text-sm text-stone-500">
                Go to
              </label>
              <input
                id="page-jump"
                type="number"
                min={1}
                max={totalPages}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                placeholder={String(page)}
                className="w-20 border border-stone-200 rounded-lg px-3 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={!pageInput}
                className="border border-stone-200 rounded-lg px-4 py-2 text-sm disabled:opacity-40 hover:bg-stone-50"
              >
                Go
              </button>
            </form>
          </div>
        )}
        </>
      )}
    </div>
  );
}

export default function MedicinesPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-display mb-2">Medicine Directory</h1>
          <p className="text-stone-400">Loading...</p>
        </div>
      }
    >
      <MedicinesContent />
    </Suspense>
  );
}