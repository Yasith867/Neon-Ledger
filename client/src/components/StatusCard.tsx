import { useWeb3 } from "@/hooks/use-web3";
import { useEvents } from "@/hooks/use-events";
import { Database, Network, CheckCircle2, XCircle } from "lucide-react";
import { clsx } from "clsx";

export function StatusCard() {
  const { chainId } = useWeb3();
  const { isConnected: isDbConnected, dbError } = useEvents();

  // Polygon Amoy Chain ID is 80002
  const isAmoy = chainId == "80002"; 
  const isNetworkReady = isAmoy;

  const StatusItem = ({ 
    icon: Icon, 
    label, 
    value, 
    isReady, 
    error 
  }: { 
    icon: any, 
    label: string, 
    value: string, 
    isReady: boolean, 
    error?: string | null 
  }) => (
    <div className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-white/5 hover:border-white/10 transition-colors">
      <div className="flex items-center gap-4">
        <div className={clsx(
          "w-10 h-10 rounded-full flex items-center justify-center",
          isReady ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <h3 className="font-semibold">{value}</h3>
          {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        </div>
      </div>
      <div className={clsx(
        "flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full",
        isReady ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
      )}>
        {isReady ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
        {isReady ? "Online" : "Offline"}
      </div>
    </div>
  );

  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <div className="w-2 h-6 bg-secondary rounded-full" />
        System Status
      </h2>

      <div className="space-y-4">
        <StatusItem
          icon={Network}
          label="Blockchain Network"
          value={isAmoy ? "Polygon Amoy" : chainId ? `Chain ID: ${chainId}` : "Disconnected"}
          isReady={isNetworkReady}
          error={!isAmoy && chainId ? "Wrong Network" : null}
        />

        <StatusItem
          icon={Database}
          label="Database Connection"
          value="Neon Postgres"
          isReady={isDbConnected}
          error={dbError}
        />
      </div>
    </div>
  );
}
