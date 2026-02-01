import { StatusCard } from "@/components/StatusCard";
import { ActionLogger } from "@/components/ActionLogger";
import { Deployer } from "@/components/Deployer";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Deployer Section - Only shows if needed */}
      <Deployer />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Interaction */}
        <div className="space-y-6">
          <ActionLogger />
        </div>

        {/* Right Column: Status */}
        <div className="space-y-6">
          <StatusCard />
          
          {/* Info Card */}
          <div className="p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-card/50 to-transparent">
            <h3 className="text-sm font-semibold mb-2 text-foreground/80">About this Architecture</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This application demonstrates a serverless Web3 pattern. It connects directly to the blockchain via 
              <span className="text-secondary"> ethers.js</span> and directly to the database via 
              <span className="text-green-400"> @neondatabase/serverless</span>. 
              No backend API servers were used in the making of this dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
