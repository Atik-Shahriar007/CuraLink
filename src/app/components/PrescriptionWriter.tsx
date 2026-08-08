"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CatalogMedicine } from "@/lib/medicineCatalog";

interface DraftItem {
  key: string;
  name: string;
  genericName: string | null;
  strengthForm: string | null;
  category: string | null;
  dosage: string;
  collectFromElsewhere: boolean;
}

interface SavedItem {
  id: string;
  name: string;
  genericName: string | null;
  strengthForm: string | null;
  category: string | null;
  dosage: string;
  collectFromElsewhere: boolean;
}

interface Props {
  consultationId: string;
  /**
   * "sidebar" fills the consultation room's fixed-height column; "page" flows
   * normally inside a document so it can also be used after the call ends.
   */
  layout?: "sidebar" | "page";
}

let keyCounter = 0;
const nextKey = () => `item-${++keyCounter}`;

export default function PrescriptionWriter({
  consultationId,
  layout = "sidebar",
}: Props) {
  const isSidebar = layout === "sidebar";
  const [items, setItems] = useState<DraftItem[]>([]);
  const [advice, setAdvice] = useState("");
  const [revision, setRevision] = useState<number | null>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CatalogMedicine[]>([]);
  const [highlight, setHighlight] = useState(0);
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [canEdit, setCanEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const boxRef = useRef<HTMLDivElement>(null);

  // Load any prescription already written for this consultation.
  useEffect(() => {
    let cancelled = false;

    fetch(`/api/consultations/${consultationId}/prescription`)
      .then(async (res) => {
        const data = await res.json();
        if (cancelled) return;

        if (!res.ok) {
          setError(data.error || "Could not load prescription");
          return;
        }

        setCanEdit(Boolean(data.canEdit));

        if (data.prescription) {
          setRevision(data.prescription.revision);
          setAdvice(data.prescription.advice || "");
          setItems(
            (data.prescription.items as SavedItem[]).map((item) => ({
              key: nextKey(),
              name: item.name,
              genericName: item.genericName,
              strengthForm: item.strengthForm,
              category: item.category,
              dosage: item.dosage,
              collectFromElsewhere: item.collectFromElsewhere,
            }))
          );
        }
      })
      .catch(() => {
        if (!cancelled) setError("Could not load prescription");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [consultationId]);

  // Debounced type-ahead against the bundled medicine catalog.
  useEffect(() => {
    const q = query.trim();

    const timer = setTimeout(() => {
      if (!q) {
        setResults([]);
        return;
      }

      fetch(`/api/medicines/search?q=${encodeURIComponent(q)}`)
        .then((res) => (res.ok ? res.json() : { results: [] }))
        .then((data) => {
          setResults(data.results || []);
          setHighlight(0);
        })
        .catch(() => setResults([]));
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  // Close the suggestion list when focus moves away from the search box.
  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const addFromCatalog = useCallback((medicine: CatalogMedicine) => {
    setItems((prev) => [
      ...prev,
      {
        key: nextKey(),
        name: medicine.name,
        genericName: medicine.genericName,
        strengthForm: medicine.strengthForm,
        category: medicine.category,
        dosage: "",
        collectFromElsewhere: false,
      },
    ]);
    setQuery("");
    setResults([]);
    setOpen(false);
  }, []);

  const addCustom = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    setItems((prev) => [
      ...prev,
      {
        key: nextKey(),
        name: trimmed,
        genericName: null,
        strengthForm: null,
        category: null,
        dosage: "",
        // Not in the catalog, so the patient sources it elsewhere.
        collectFromElsewhere: true,
      },
    ]);
    setQuery("");
    setResults([]);
    setOpen(false);
  }, []);

  const exactMatch = results.some(
    (r) => r.name.toLowerCase() === query.trim().toLowerCase()
  );
  const showCustomOption = query.trim().length > 0 && !exactMatch;
  const optionCount = results.length + (showCustomOption ? 1 : 0);

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || optionCount === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % optionCount);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 + optionCount) % optionCount);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlight < results.length) {
        addFromCatalog(results[highlight]);
      } else {
        addCustom(query);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  function updateDosage(key: string, dosage: string) {
    setItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, dosage } : item))
    );
  }

  function removeItem(key: string) {
    setItems((prev) => prev.filter((item) => item.key !== key));
  }

  async function handleSave() {
    setError("");
    setMessage("");

    if (items.length === 0) {
      setError("Add at least one medicine.");
      return;
    }
    if (items.some((item) => !item.dosage.trim())) {
      setError("Write dosage instructions for every medicine.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(
        `/api/consultations/${consultationId}/prescription`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            advice: advice.trim() || null,
            items: items.map((item) => ({
              name: item.name,
              genericName: item.genericName,
              strengthForm: item.strengthForm,
              category: item.category,
              dosage: item.dosage.trim(),
            })),
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not save prescription");
        return;
      }

      setRevision(data.prescription.revision);
      setItems(
        (data.prescription.items as SavedItem[]).map((item) => ({
          key: nextKey(),
          name: item.name,
          genericName: item.genericName,
          strengthForm: item.strengthForm,
          category: item.category,
          dosage: item.dosage,
          collectFromElsewhere: item.collectFromElsewhere,
        }))
      );
      setMessage(
        data.isUpdate
          ? "Prescription updated. The patient has been notified."
          : "Prescription sent to the patient."
      );
    } catch {
      setError("Something went wrong saving the prescription.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="px-4 py-3 text-sm text-gray-400">Loading...</p>;
  }

  if (!canEdit) {
    return (
      <div
        className={
          isSidebar
            ? "px-4 py-3"
            : "border rounded-xl p-5 bg-gray-50 min-h-[120px]"
        }
      >
        <p className="text-sm text-gray-500">
          You can write a prescription while you are in the call with this
          patient.
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        isSidebar
          ? "flex-1 flex flex-col min-h-0"
          : "border rounded-xl bg-white overflow-hidden"
      }
    >
      <div
        className={
          isSidebar
            ? "flex-1 overflow-y-auto px-4 py-3 space-y-3"
            : "px-5 py-4 space-y-3"
        }
      >
        {revision !== null && (
          <p className="text-xs text-gray-500">
            {revision === 1
              ? "Prescription sent."
              : `Prescription sent · revision ${revision}`}
          </p>
        )}

        <div ref={boxRef} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search medicine..."
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />

          {open && optionCount > 0 && (
            <ul className="absolute z-10 left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto">
              {results.map((medicine, i) => (
                <li key={`${medicine.name}-${i}`}>
                  <button
                    type="button"
                    onMouseEnter={() => setHighlight(i)}
                    onClick={() => addFromCatalog(medicine)}
                    className={`w-full text-left px-3 py-2 ${
                      highlight === i ? "bg-gray-100" : ""
                    }`}
                  >
                    <span className="block text-sm font-medium">
                      {medicine.name}
                    </span>
                    <span className="block text-xs text-gray-500">
                      {medicine.genericName}
                      {medicine.strengthForm ? ` · ${medicine.strengthForm}` : ""}
                    </span>
                  </button>
                </li>
              ))}

              {showCustomOption && (
                <li>
                  <button
                    type="button"
                    onMouseEnter={() => setHighlight(results.length)}
                    onClick={() => addCustom(query)}
                    className={`w-full text-left px-3 py-2 border-t ${
                      highlight === results.length ? "bg-gray-100" : ""
                    }`}
                  >
                    <span className="block text-sm font-medium">
                      Add &ldquo;{query.trim()}&rdquo;
                    </span>
                    <span className="block text-xs text-amber-700">
                      Not in catalog · collect from elsewhere
                    </span>
                  </button>
                </li>
              )}
            </ul>
          )}
        </div>

        {items.length === 0 && (
          <p className="text-sm text-gray-400">No medicines added yet.</p>
        )}

        {items.map((item) => (
          <div key={item.key} className="border rounded-lg p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium break-words">{item.name}</p>
                {(item.genericName || item.strengthForm) && (
                  <p className="text-xs text-gray-500 break-words">
                    {item.genericName}
                    {item.strengthForm ? ` · ${item.strengthForm}` : ""}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.key)}
                className="text-xs text-red-600 hover:underline flex-shrink-0"
              >
                Remove
              </button>
            </div>

            {item.collectFromElsewhere && (
              <span className="inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Collect from elsewhere
              </span>
            )}

            <textarea
              value={item.dosage}
              onChange={(e) => updateDosage(item.key, e.target.value)}
              placeholder="e.g. 1 tablet twice daily after meals for 5 days"
              className="mt-2 w-full border rounded-lg px-3 py-2 text-sm h-16"
            />
          </div>
        ))}

        <div>
          <label className="block text-xs text-gray-500 mb-1">
            General advice (optional)
          </label>
          <textarea
            value={advice}
            onChange={(e) => setAdvice(e.target.value)}
            placeholder="e.g. Drink plenty of water, follow up in 2 weeks."
            className="w-full border rounded-lg px-3 py-2 text-sm h-20"
          />
        </div>

        {message && <p className="text-sm text-green-700">{message}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <div className={isSidebar ? "border-t p-3" : "border-t p-4"}>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : revision === null
              ? "Send Prescription"
              : "Update Prescription"}
        </button>
      </div>
    </div>
  );
}
