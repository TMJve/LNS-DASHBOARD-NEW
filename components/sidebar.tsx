// components/sidebar.tsx
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  // Settings, <-- This was the error
} from "lucide-react";

export function Sidebar() {
  return (
    <div className="w-64 border-r bg-accent/40 p-4 flex flex-col gap-2">
      <h2 className="text-lg font-semibold mb-2">Nimbiiz LNS</h2>
      <nav className="flex flex-col gap-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/leads"
          className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
        >
          <Users size={18} />
          <span>Leads</span>
        </Link>
        <Link
          href="/activity"
          className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
        >
          <BarChart3 size={18} />
          <span>Activity</span>
        </Link>
        {/* We can add this link later */}
        {/* <Link
          href="/settings"
          className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
        >
          <Settings size={18} />
          <span>Settings</span>
        </Link> */}
      </nav>
    </div>
  );
}