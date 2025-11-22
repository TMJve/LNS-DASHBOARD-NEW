// components/leads-table.tsx
"use client"; // <-- Now a client component

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";

// Import the Server Actions
import { updateLeadStatus, deleteLead } from "@/lib/actions";

// 1. Define the 'Lead' type based on what we're fetching
export type Lead = {
  id: string;
  first_name: string | null;
  email: string | null;
  status: string | null;
  created_at: string;
  source: string | null;
};

// 2. Define the props: it just takes an array of leads
type LeadsTableProps = {
  leads: Lead[];
};

export function LeadsTable({ leads }: LeadsTableProps) {
  // 3. No data fetching here!
  // The component just renders what it's given.

  if (!leads || leads.length === 0) {
    return <p>No leads found matching your criteria.</p>;
  }

  const statuses = ["New Lead", "Nurturing", "Trial Booked", "Confirmed", "Closed"];

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Date Added</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>
                <div className="font-medium">{lead.first_name || "No Name"}</div>
                <div className="text-sm text-muted-foreground">{lead.email}</div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {lead.status || "Unknown"}
                </Badge>
              </TableCell>
              <TableCell>{lead.source || "Unknown"}</TableCell>
              <TableCell>
                {new Date(lead.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                {/* 4. The actions still work perfectly */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {statuses
                      .filter((s) => s !== lead.status)
                      .map((status) => (
                        <form action={updateLeadStatus} key={status}>
                          <input type="hidden" name="id" value={lead.id} />
                          <input type="hidden" name="status" value={status} />
                          <DropdownMenuItem asChild>
                            <button type="submit" className="w-full">
                              Set as: {status}
                            </button>
                          </DropdownMenuItem>
                        </form>
                      ))}
                    <form action={deleteLead} className="w-full">
                      <input type="hidden" name="id" value={lead.id} />
                      <DropdownMenuItem asChild>
                        <button
                          type="submit"
                          className="w-full text-red-500 justify-start"
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </button>
                      </DropdownMenuItem>
                    </form>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}