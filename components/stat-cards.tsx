// components/stat-cards.tsx
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Mail, CheckCircle, XCircle } from "lucide-react"; // Added XCircle
import { PostgrestError } from "@supabase/supabase-js";

// --- 1. DEFINE YOUR MASTER FUNNEL STATUSES ---
// This is the master list. You can add, remove, or re-order these!
// These are the only statuses that will get a card.
const MAIN_STATUSES = [
  "New Lead",
  "Nurturing",
  "Trial Booked",
  "Confirmed",
  "Closed",
];

// Helper to pick an icon based on status (unchanged)
const getIconForStatus = (status: string) => {
  if (
    status.toLowerCase().includes("trial") ||
    status.toLowerCase().includes("confirmed")
  ) {
    return <CheckCircle className="h-5 w-5 text-green-500" />;
  }
  if (
    status.toLowerCase().includes("email") ||
    status.toLowerCase().includes("nurturing")
  ) {
    return <Mail className="h-5 w-5 text-blue-500" />;
  }
  if (status.toLowerCase().includes("closed")) {
    return <XCircle className="h-5 w-5 text-red-500" />;
  }
  return <Users className="h-5 w-5 text-muted-foreground" />;
};

// Define the type for our RPC response
type StatResult = {
  status: string | null;
  count: number;
};

export async function StatCards() {
  const supabase = await createClient();

  const { data: dbStats, error }: { data: StatResult[] | null; error: PostgrestError | null } =
    await supabase.rpc("get_stats_by_status");

  if (error) {
    console.error("Error fetching stats:", error?.message);
    return <p className="text-red-500">Could not load stats.</p>;
  }

  // --- 2. MERGE THE MASTER LIST WITH THE DB RESULTS ---

  // Create a Map for fast lookups of the counts we got from the DB
  const statsMap = new Map<string, number>();
  dbStats?.forEach((stat) => {
    if (stat.status) {
      statsMap.set(stat.status, stat.count);
    }
  });

  // Create the final array by looping over our MASTER list
  // and pulling the count from the Map, or defaulting to 0.
  const allStats = MAIN_STATUSES.map((status) => ({
    status: status,
    count: statsMap.get(status) || 0,
  }));

  // -------------------------------------------------

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {/* 3. Map over the 'allStats' array, not the 'dbStats' */}
      {allStats.map((stat) => (
        <Card key={stat.status}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium capitalize">
              {stat.status}
            </CardTitle>
            {getIconForStatus(stat.status)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.count}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}