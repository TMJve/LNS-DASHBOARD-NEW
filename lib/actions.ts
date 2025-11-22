// lib/actions.ts
"use server"; // <-- Mark this file as Server Actions

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Action to update a lead's status
export async function updateLeadStatus(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const newStatus = formData.get("status") as string;

  if (!id || !newStatus) return;

  // RLS ensures we can only update leads for our own tenant
  await supabase.from("leads").update({ status: newStatus }).eq("id", id);

  revalidatePath("/leads"); // Refresh the data on this page
  revalidatePath("/dashboard"); // Also refresh the dashboard stats
}

// Action to delete a lead
export async function deleteLead(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  if (!id) return;

  // RLS ensures we can only delete leads for our own tenant
  await supabase.from("leads").delete().eq("id", id);

  revalidatePath("/leads"); // Refresh the data on this page
  revalidatePath("/dashboard"); // Also refresh the dashboard stats
}


export async function getFilteredLeads(query: string, status: string) {
  const supabase = await createClient();

  let queryBuilder = supabase
    .from("leads")
    .select("id, first_name, email, status, created_at, source");

  // Reworked logic
  if (query && status && status !== "all") { // <-- Added status !== 'all'
    // Both filters are active (and status is not 'all')
    queryBuilder = queryBuilder
      .eq("status", status)
      .or(`first_name.ilike.${query}%,email.ilike.${query}%`);
  } else if (query) {
    // Only query is active
    queryBuilder = queryBuilder.or(
      `first_name.ilike.${query}%,email.ilike.${query}%`
    );
  // --- THIS IS THE FIX ---
  } else if (status && status !== "all") { // <-- Added status !== 'all'
    // Only status is active (and it's not 'all')
    queryBuilder = queryBuilder.eq("status", status);
  }
  // --- END OF FIX ---
  // If status is 'all', no status filter is applied

  // Finally, sort and return
  const { data: leads, error } = await queryBuilder.order("created_at", {
    ascending: false,
  });

  if (error) {
    console.error("Error fetching leads:", error.message);
    return []; // Return an empty array on error
  }

  return leads;
}