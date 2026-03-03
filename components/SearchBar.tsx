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
        `http://localhost:8080/api/admin/residents/search?q=${query}`,
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
    <div className="w-full max-w-md">

      <div className="relative">

        <input
          type="text"
          placeholder="Search residents by name or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="text-black w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {loading && (
          <span className="absolute right-3 top-2 text-sm text-gray-500">
            Searching...
          </span>
        )}

      </div>

      {results.length > 0 && (
        <div className="mt-2 border rounded-md bg-white shadow-sm max-h-60 overflow-y-auto">

          {results.map((resident) => (
            <div
              key={resident.id}
              className="p-3 border-b last:border-none hover:bg-gray-50 cursor-pointer"
              onClick={() => console.log("Selected:", resident)}
            >
              <div className="font-medium text-black">
                {resident.name}
              </div>

              <div className="text-sm text-gray-600">
                {resident.email}
              </div>

              {resident.flatNumber && (
                <div className="text-xs text-gray-500">
                  Flat: {resident.flatNumber}
                </div>
              )}
            </div>
          ))}

        </div>
      )}

    </div>
  );
}