import { EventFeed } from "@/components/EventFeed";
import { motion } from "framer-motion";

export default function Activity() {
  return (
    <div className="h-[calc(100vh-12rem)] min-h-[600px] flex flex-col space-y-6">
      <div className="space-y-2 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight">Activity Feed</h1>
        <p className="text-muted-foreground">Real-time stream of all events indexed from Polygon Amoy.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex-1 min-h-0"
      >
        <EventFeed />
      </motion.div>
    </div>
  );
}
