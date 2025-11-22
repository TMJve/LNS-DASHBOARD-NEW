// app/(dashboard)/activity/page.tsx
import { ActivityFeed } from "@/components/activity-feed";
import { Suspense } from "react";

export default function ActivityPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      {/* Page Header */}
      <h1 className="font-bold text-2xl">Activity Feed</h1>
      <p className="text-muted-foreground">
        A live log of all events and automations happening in your account.
      </p>

      {/* The Activity Feed Component */}
      <Suspense fallback={<p>Loading activity...</p>}>
        {/* We pass a 'fullPage' prop to tell it to show everything */}
        <ActivityFeed fullPage={true} />
      </Suspense>
    </div>
  );
}