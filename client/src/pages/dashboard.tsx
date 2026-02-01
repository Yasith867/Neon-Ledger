import { ActionLogger } from "@/components/ActionLogger";
import { StatusCard } from "@/components/StatusCard";
import { EventFeed } from "@/components/EventFeed";
import { motion } from "framer-motion";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Manage your on-chain interactions and monitor system health.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column: Interaction & Status */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ActionLogger />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:hidden" // Show status below logger on mobile, but in sidebar on desktop
          >
            <StatusCard />
          </motion.div>

          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="md:h-[400px]">
               <EventFeed limit={5} />
            </div>
          </motion.div>
        </div>

        {/* Right Column: Status (Desktop) */}
        <div className="hidden md:block space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="sticky top-24"
          >
            <StatusCard />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
