import { ActionLogger } from "@/components/ActionLogger";
import { StatusCard } from "@/components/StatusCard";
import { motion } from "framer-motion";

export default function Dashboard() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Manage your onchain interactions and monitor system health.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="h-full"
        >
          <ActionLogger />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="h-full"
        >
          <StatusCard />
        </motion.div>
      </div>
    </div>
  );
}
