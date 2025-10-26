// app/protected/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { InfoIcon, Building } from "lucide-react";
import { FetchDataSteps } from "@/components/tutorial/fetch-data-steps";
import { LeadsList } from "@/components/leads-list";


export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  // This query is working perfectly
  const { data: tenantData, error: tenantError } = await supabase
    .from("profiles")
    .select(
      `
      tenant_id,
      tenants (
        name,
        tenant_slug
      )
    `,
    )
    .eq("id", user.id) // Get profile matching the logged-in user
    .single(); // We only expect one

  if (tenantError) {
    console.error("Error fetching tenant:", tenantError.message);
  }

  // --- THIS IS THE FIX ---
  // We removed the [0] because the log shows 'tenants' is an object
  const tenant = Array.isArray(tenantData?.tenants) ? tenantData.tenants[0] : tenantData?.tenants;
  const tenantName = tenant?.name || "Your Dashboard";

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user.
        </div>
      </div>

      {/* Display the Tenant Name */}
      <div className="flex flex-col gap-2 items-start">
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          <h1 className="font-bold text-2xl">{tenantName}</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Welcome to your LNS dashboard.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="font-bold text-2xl">Recent Leads</h2>
        <LeadsList />
      </div>

      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your user details</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <div>
        <h2 className="font-bold text-2xl mb-4">Next steps</h2>
        <FetchDataSteps />
      </div>
    </div>
  );
}