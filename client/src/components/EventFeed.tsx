import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { EventLog } from "@/hooks/use-events";
import { Activity, Database, Clock } from "lucide-react";

interface EventFeedProps {
  events: EventLog[];
  isLoading: boolean;
  error: string | null;
}

export function EventFeed({ events, isLoading, error }: EventFeedProps) {
  if (error) {
    return (
      <div className="p-8 rounded-2xl glass-card text-center border-red-500/20 bg-red-500/5">
        <Database className="w-12 h-12 mx-auto text-red-400 mb-4 opacity-50" />
        <h3 className="text-lg font-bold text-red-200">Database Connection Failed</h3>
        <p className="text-red-400/80 mt-2 text-sm">{error}</p>
      </div>
    );
  }

  if (isLoading && events.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-2xl glass-card animate-pulse bg-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Live Activity Feed
        </h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-white/5 px-3 py-1 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Live Polling
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {events.map((event) => (
            <motion.div
              key={`${event.id}-${event.created_at}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="glass-card p-5 rounded-2xl group hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-mono font-medium border border-primary/20">
                      Action Logged
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="font-medium text-lg text-foreground/90">
                    "{event.action}"
                  </p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">User Address</span>
                <span className="font-mono text-primary/80 bg-primary/5 px-2 py-1 rounded">
                  {event.user_address}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {events.length === 0 && (
          <div className="text-center py-12 rounded-2xl glass-panel border-dashed border-white/10">
            <p className="text-muted-foreground">No events logged yet.</p>
            <p className="text-sm text-muted-foreground/50 mt-1">Be the first to interact with the blockchain!</p>
          </div>
        )}
      </div>
    </div>
  );
}
