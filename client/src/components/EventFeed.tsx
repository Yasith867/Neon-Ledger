import { useEvents } from "@/hooks/use-events";
import { formatDistanceToNow } from "date-fns";
import { Activity, Clock, Hash, Database } from "lucide-react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";

export function EventFeed({ limit }: { limit?: number }) {
  const { events, isLoading, dbError } = useEvents();

  // Handle various states
  if (dbError) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center space-y-4 border-destructive/20 bg-destructive/5">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto text-destructive animate-pulse">
          <Database className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-destructive">Database Connection Failed</h3>
          <p className="text-sm text-destructive/80 max-w-xs mx-auto">
            Unable to connect to Neon Postgres. Check your environment variables.
          </p>
        </div>
      </div>
    );
  }

  const displayEvents = limit ? events.slice(0, limit) : events;

  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-full min-h-[400px]">
      <div className="p-6 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 bg-secondary rounded-full" />
            <h2 className="text-lg font-bold">Live Activity Feed</h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground px-3 py-1 rounded-full bg-white/5 border border-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Real-time Sync
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 space-y-4">
        {isLoading && events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-muted-foreground">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-sm font-medium">Syncing with Neon...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-4 text-muted-foreground border-2 border-dashed border-white/5 rounded-xl bg-white/[0.01]">
            <Activity className="w-10 h-10 opacity-20" />
            <p className="text-sm">No events found on-chain yet.</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {displayEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group relative flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl bg-background/40 hover:bg-background/60 border border-white/5 hover:border-white/10 transition-all hover:shadow-lg hover:shadow-black/20"
              >
                {/* Visual Connector for Timeline feel */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-white/5 md:hidden -z-10" />

                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                    <Hash className="w-4 h-4 text-secondary/70" />
                  </div>
                  
                  <div className="min-w-0 space-y-1">
                    <p className="text-sm font-medium text-white truncate pr-4">
                      {event.action}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                      <span className="text-secondary/60">
                        {event.user_address.slice(0, 6)}...{event.user_address.slice(-4)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground/60 shrink-0 md:pl-4 md:border-l md:border-white/5 pl-14">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
