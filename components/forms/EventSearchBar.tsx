"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { categories } from "@/lib/data/categories";

export default function EventSearchBar() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  // Initialise from URL params so the bar reflects any pre-existing filter state
  const [query, setQuery]               = useState(searchParams.get("q") ?? "");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") ?? "All");

  // Keep local state in sync if the URL changes externally (e.g. browser back/forward)
  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
    setActiveCategory(searchParams.get("category") ?? "All");
  }, [searchParams]);

  /** Build a new URL and navigate — no full page reload */
  const navigate = (q: string, category: string) => {
    const params = new URLSearchParams();
    if (q.trim())          params.set("q", q.trim());
    if (category !== "All") params.set("category", category);
    // Preserve any other params (e.g. date, sort) the Events page may have added
    for (const [key, value] of searchParams.entries()) {
      if (key !== "q" && key !== "category") params.set(key, value);
    }
    router.push(`/events${params.size ? `?${params.toString()}` : ""}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(query, activeCategory);
  };

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    navigate(query, cat);          // ← instant filter on click
  };

  const handleClear = () => {
    setQuery("");
    navigate("", activeCategory);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Search bar */}
      <form
        onSubmit={handleSearch}
        aria-label="Search events"
        className="flex items-center gap-2 bg-white border border-border-strong rounded-2xl p-2 shadow-card max-w-xl focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent transition-all"
      >
        <Search className="ml-2 h-4 w-4 text-ink-subtle shrink-0" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search events..."
          className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-subtle focus:outline-none py-1"
          aria-label="Search events by name, category or venue"
        />
        {/* Clear button — only visible when there's a query */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="text-ink-subtle hover:text-ink transition-colors p-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        <Button type="submit" variant="primary" size="sm" className="rounded-xl shrink-0">
          Search
        </Button>
      </form>

      {/* Category filter pills — clicking immediately updates results */}
      <div
        className="flex flex-wrap gap-2 items-center pb-4 border-b border-border"
        role="group"
        aria-label="Filter by category"
      >
        {["All", ...categories.map((c) => c.label)].map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryClick(cat)}
              aria-pressed={isActive}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? "bg-brand-500 text-white border border-brand-500"
                  : "border border-border bg-white text-ink-secondary hover:border-brand-400 hover:text-brand-500 hover:bg-brand-50"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
