// app/(dashboard)/leads/page.tsx
"use client"; // <-- 1. This is now a CLIENT component

import { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

import { LeadsTable, type Lead } from "@/components/leads-table"; // Import the dumb table and its type
import { getFilteredLeads } from "@/lib/actions"; // Import our new data-fetching action
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// These are the statuses you defined. We add "all"
const statuses = ["all", "New Lead", "Nurturing", "Trial Booked", "Confirmed", "Closed"];

export default function LeadsPage() {
  // 2. Get URL params to set initial state
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const initialQuery = searchParams.get("q") || "";
  const initialStatus = searchParams.get("status") || "all";

  // 3. Page state for filters and the leads data
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState(initialStatus);
  const [leads, setLeads] = useState<Lead[]>([]); // State to hold the data
  const [isLoading, setIsLoading] = useState(true);

  // 4. Debounced function to update the URL (and state)
  const handleSearch = useDebouncedCallback((term: string) => {
    setQuery(term);
    updateURL(term, status);
  }, 300);

  // 5. Function to update URL (and state)
  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    updateURL(query, newStatus);
  };

  // 6. Helper to update the URL bar
  const updateURL = (currentQuery: string, currentStatus: string) => {
    const params = new URLSearchParams(searchParams);
    if (currentQuery) {
      params.set("q", currentQuery);
    } else {
      params.delete("q");
    }
    if (currentStatus && currentStatus !== "all") {
      params.set("status", currentStatus);
    } else {
      params.delete("status");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  // 7. This is the core: useEffect hook to fetch data
  // It runs when the component loads, and again ANY time 'query' or 'status' changes
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true); // Start loading
      // We call our Server Action to get the filtered data
      const newLeads = await getFilteredLeads(query, status);
      setLeads(newLeads); // Put the data in state
      setIsLoading(false); // Stop loading
    }

    fetchData();
  }, [query, status]); // The "dependency array"

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      {/* Page Header */}
      <h1 className="font-bold text-2xl">Lead Management</h1>
      <p className="text-muted-foreground">
        Search, filter, and manage all the leads in your funnel.
      </p>

      {/* 8. The filters now control the STATE, not the URL directly */}
      <div className="flex gap-4">
        <Input
          placeholder="Search by name or email..."
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={initialQuery}
          className="max-w-sm"
        />
        <Select
          onValueChange={handleStatusChange}
          defaultValue={initialStatus}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 9. The table is now "dumb" and just receives the leads from our state */}
      {isLoading ? (
        <p>Loading leads...</p>
      ) : (
        <LeadsTable leads={leads} />
      )}
    </div>
  );
}