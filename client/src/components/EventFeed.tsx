import { useEvents } from "@/hooks/use-events";
import { formatDistanceToNow } from "date-fns";
import { Activity, Box, Hash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function EventFeed() {
  const { events, isLoading, dbError } = useEvents();

  if (isLoading) {
    return (
      <div className="glass-panel rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-primary rounded-full" />
          </div>
        </div>
        <p className="mt-4 text-muted-foreground animate-pulse">Syncing with Neon DB...</p>
      </div>
    );
  }

  if (dbError) {
    return (
      <div className="glass-panel rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <Activity className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Connection Error</h3>
        <p className="text-muted-foreground mt-2 max-w-sm">{dbError}</p>
        <p className="text-xs text-muted-foreground mt-4">Check VITE_DATABASE_URL environment variable.</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Box className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-bold text-foreground">No Activity Yet</h3>
        <p className="text-muted-foreground mt-2">Log an action to see it appear here in real-time.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-12rem)] min-h-[500px]">
      <div className="p-6 border-b border-white/5 bg-background/50 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
            <Activity className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold">Live Onchain Activity</h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground bg-white/5 px-3 py-1 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Live Feed
        </div>
      </div>

      <div className="overflow-y-auto flex-1 p-6 space-y-4 custom-scrollbar">
        <AnimatePresence initial={false}>
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="group p-4 rounded-xl bg-background/40 border border-white/5 hover:border-primary/30 hover:bg-white/5 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0 border border-white/5 mt-1 md:mt-0">
                    <Hash className="w-5 h-5 text-foreground/80" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground text-lg">{event.action}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {event.user_address.slice(0, 6)}...{event.user_address.slice(-4)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right pl-14 md:pl-0">
                  <p className="text-xs text-muted-foreground font-medium">
                    {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 font-mono mt-1 uppercase tracking-wide">
                    Confirmed
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
