import { EventFeed } from "@/components/EventFeed";
import { motion } from "framer-motion";

export default function Activity() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Activity Feed</h1>
        <p className="text-muted-foreground">Real-time stream of actions indexed from Polygon Amoy to Neon Postgres.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1"
      >
        <EventFeed />
      </motion.div>
    </div>
  );
}
