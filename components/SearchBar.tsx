"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Resident {
  id: number;
  name: string;
  email: string;
  flatNumber?: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      searchResidents();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const searchResidents = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${process.env.BASE_URL}/api/admin/residents/search?q=${query}`,
        { withCredentials: true }
      );

      console.log("Residents found:", res.data);

      setResults(res.data);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm relative">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: "var(--muted-foreground)" }}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search residents…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border transition-all duration-150"
          style={{
            background: "var(--card)",
            border: "1.5px solid var(--border)",
            color: "var(--foreground)",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        />
        {loading && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
            style={{ color: "var(--muted-foreground)" }}
          >
            …
          </span>
        )}
      </div>

      {results.length > 0 && (
        <div
          className="absolute z-20 w-full mt-1 rounded-lg border overflow-hidden"
          style={{
            background: "var(--card)",
            borderColor: "var(--border)",
            boxShadow: "var(--shadow-md)",
            maxHeight: "240px",
            overflowY: "auto",
          }}
        >
          {results.map((resident) => (
            <div
              key={resident.id}
              className="px-4 py-2.5 cursor-pointer transition-colors duration-100 border-b last:border-none"
              style={{ borderColor: "var(--border)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--muted)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              onClick={() => console.log("Selected:", resident)}
            >
              <div className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                {resident.name}
              </div>
              <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                {resident.email}
                {resident.flatNumber && ` · Flat ${resident.flatNumber}`}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}