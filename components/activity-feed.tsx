// components/activity-feed.tsx
import { createClient } from "@/lib/supabase/server";
import { Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Helper function (unchanged)
function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);

  if (seconds < 60) return `${seconds} sec ago`;
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  return new Date(dateString).toLocaleDateString();
}

// --- NEW: Define props for the component ---
type ActivityFeedProps = {
  fullPage?: boolean;
};

export async function ActivityFeed({ fullPage = false }: ActivityFeedProps) {
  const supabase = await createClient();

  // Base query
  let query = supabase
    .from("events")
    .select("id, event_type, created_at")
    .order("created_at", { ascending: false });

  // --- NEW: Conditionally add a limit ---
  if (!fullPage) {
    query = query.limit(10);
  }

  const { data: events, error } = await query;

  if (error) {
    console.error("Error fetching events:", error.message);
    if (error.message.includes("column") && error.message.includes("does not exist")) {
      return (
        <p className="text-sm text-yellow-500">
          Feed is updating... (DB schema might be missing a column)
        </p>
      );
    }
  }

  const content = (
    <>
      {(!events || events.length === 0) ? (
        <p className="text-sm text-muted-foreground">
          No activity yet. New events from your n8n workflow will appear here.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {events.map((event) => (
            <div key={event.id} className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">{event.event_type}</p>
                <p className="text-xs text-muted-foreground">
                  {timeAgo(event.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  // If it's the full page, just return the content.
  // If it's NOT the full page (on the dashboard), wrap it in a Card.
  if (fullPage) {
    return (
      <Card>
        <CardContent className="pt-6">{content}</CardContent>
      </Card>
    );
  }

  // This is for the dashboard
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Activity Feed</CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}