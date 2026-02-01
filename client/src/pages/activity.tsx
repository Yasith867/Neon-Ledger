import { EventFeed } from "@/components/EventFeed";

export default function Activity() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Onchain Activity</h1>
        <div className="text-sm text-muted-foreground">
          Auto-refreshing every 2s
        </div>
      </div>

      <EventFeed />
    </div>
  );
}
