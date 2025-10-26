// components/leads-list.tsx
import { createClient } from "@/lib/supabase/server";

export async function LeadsList() {
  const supabase = await createClient();

  // Fetch leads. RLS automatically filters this to ONLY
  // get leads for the currently logged-in tenant.
  const { data: leads, error } = await supabase
    .from("leads")
    .select("first_name, email, status, created_at")
    .order("created_at", { ascending: false }); // Show newest first

  if (error) {
    return <p className="text-red-500">Error fetching leads: {error.message}</p>;
  }

  if (!leads || leads.length === 0) {
    return (
      <div className="p-6 text-center bg-accent rounded-md">
        <h3 className="font-semibold">No leads yet!</h3>
        <p className="text-sm text-muted-foreground">
          Your new leads will appear here once they are captured.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {leads.map((lead) => (
        <div
          key={lead.email} // Using email as a key for this example
          className="p-4 border rounded-md flex justify-between items-center"
        >
          <div>
            <p className="font-medium">{lead.first_name}</p>
            <p className="text-sm text-muted-foreground">{lead.email}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold capitalize">{lead.status}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(lead.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}