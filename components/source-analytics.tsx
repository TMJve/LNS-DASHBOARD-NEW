// components/source-analytics.tsx
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PostgrestError } from "@supabase/supabase-js"; // <-- 1. Import error type

// Define the type for our RPC response
type SourceResult = {
  source: string | null;
  count: number;
};

export async function SourceAnalytics() {
  const supabase = await createClient();

  // --- THIS IS THE FIX ---
  // 2. Explicitly typed `sources` and `error`
  const { data: sources, error }: { data: SourceResult[] | null; error: PostgrestError | null } =
    await supabase.rpc("get_stats_by_source");
  // ---------------------

  if (error || !sources || sources.length === 0) {
    console.error("Error fetching sources:", error?.message);
    return null; // Don't show anything if there's an error or no data
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Leads by Source</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {/* 'item' is now correctly typed from the `sources` variable */}
          {sources.map((item) => (
            <Badge key={item.source || "unknown"} variant="secondary" className="text-sm">
              {item.source || "Unknown"}:{" "}
              <strong className="ml-1.5">{item.count}</strong>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}