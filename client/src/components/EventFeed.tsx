import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Database, Clock, Hash, AlertCircle } from "lucide-react";
import { EventLog } from "@/hooks/use-events";

interface EventFeedProps {
  events: EventLog[];
  isLoading: boolean;
  error: string | null;
}

export function EventFeed({ events, isLoading, error }: EventFeedProps) {
  const shortenAddress = (addr: string) => {
    if (!addr) return "???";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex flex-col h-[500px] rounded-2xl border border-border bg-card shadow-xl overflow-hidden cyan-glow"
    >
      <div className="p-6 border-b border-border/50 bg-card/50 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary/15 text-secondary border border-secondary/20">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Live Activity Feed</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              Syncing from Neon Postgres
            </p>
          </div>
        </div>
        <div className="text-xs font-mono text-muted-foreground/50 bg-muted/20 px-2 py-1 rounded">
          Table: events
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {error && (
          <div className="flex flex-col items-center justify-center h-full text-destructive space-y-2 p-6 text-center">
            <AlertCircle className="w-10 h-10 mb-2" />
            <p className="font-semibold">Connection Error</p>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        )}

        {!error && isLoading && events.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
            <div className="w-8 h-8 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" />
            <p className="text-sm">Fetching blockchain events...</p>
          </div>
        )}

        {!error && !isLoading && events.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground/50 space-y-4">
            <Hash className="w-12 h-12 opacity-20" />
            <p className="text-sm">No events found yet</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group relative p-4 rounded-xl bg-background/50 border border-border/50 hover:bg-muted/20 hover:border-secondary/30 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-medium text-secondary bg-secondary/10 px-1.5 py-0.5 rounded border border-secondary/20">
                      {shortenAddress(event.user_address)}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90 font-medium truncate pl-1 border-l-2 border-primary/30 group-hover:border-primary transition-colors">
                    {event.action}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
