// app/(dashboard)/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Building, ArrowRight } from "lucide-react";
import { LeadsList } from "@/components/leads-list";
import { StatCards } from "@/components/stat-cards";
import { ActivityFeed } from "@/components/activity-feed";
import { SourceBarChart } from "@/components/source-bar-chart";
import { Suspense } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PostgrestError } from "@supabase/supabase-js";

// A simple loading skeleton
const LoadingSkeleton = () => (
  <Card>
    <CardHeader>
      <CardTitle className="h-5 w-32 bg-muted-foreground/20 rounded-md"></CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-8 w-16 bg-muted-foreground/20 rounded-md"></div>
    </CardContent>
  </Card>
);

// Define the type for our RPC response
type SourceData = {
  source: string | null;
  count: number;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  
  // 1. Check Auth (Standard check)
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/auth/login");

  // --- REMOVED TENANT QUERY HERE ---
  // We don't need to look up who owns the data. The user is logged in,
  // so they own ALL the data in this database.

  // 2. Fetch Stats Data (Source Chart)
  const { data: sourceData, error: sourceError }: { data: SourceData[] | null; error: PostgrestError | null } =
    await supabase.rpc("get_stats_by_source");

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2 items-start">
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          {/* You can hardcode "Dashboard" or use an Env Variable for the Client Name */}
          <h1 className="font-bold text-2xl">Dashboard</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Overview of your lead generation system.
        </p>
      </div>

      {/* 1. Funnel Stat Cards (Full Width) */}
      <Suspense fallback={<LoadingSkeleton />}>
        <StatCards />
      </Suspense>

      {/* 2. Side-by-Side Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Column (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <Suspense fallback={<LoadingSkeleton />}>
            {/* Pass the fetched data to the chart */}
            <SourceBarChart data={sourceData || []} />
          </Suspense>
          
          <Suspense fallback={<LoadingSkeleton />}>
            <ActivityFeed />
          </Suspense>
        </div>

        {/* Side Column (1/3 width) */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Recent Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<LoadingSkeleton />}>
                <LeadsList />
              </Suspense>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/leads">
                  View All Leads
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}