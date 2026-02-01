import { useWeb3 } from "@/hooks/use-web3";
import { useEvents } from "@/hooks/use-events";
import { Database, Network, FileCode2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { clsx } from "clsx";

export function StatusCard() {
  const { chainId, isContractConfigured, account } = useWeb3();
  const { isConnected: isDbConnected, dbError } = useEvents();

  // Polygon Amoy Chain ID is 80002
  const isAmoy = chainId == "80002"; 
  const isNetworkReady = isAmoy;
  
  // Contract is ready ONLY if configured AND we are connected to right network
  const isContractReady = isContractConfigured && isAmoy && !!account;

  const StatusItem = ({ 
    icon: Icon, 
    label, 
    value, 
    status, // 'ready' | 'error' | 'warning'
    message
  }: { 
    icon: any, 
    label: string, 
    value: string, 
    status: 'ready' | 'error' | 'warning',
    message?: string | null 
  }) => (
    <div className="flex items-center justify-between p-4 rounded-xl bg-background/40 border border-white/5 hover:border-white/10 transition-colors group">
      <div className="flex items-center gap-4">
        <div className={clsx(
          "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
          status === 'ready' && "bg-green-500/10 text-green-500 group-hover:bg-green-500/20",
          status === 'error' && "bg-red-500/10 text-red-500 group-hover:bg-red-500/20",
          status === 'warning' && "bg-orange-500/10 text-orange-500 group-hover:bg-orange-500/20"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm md:text-base">{value}</h3>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-1">
        <div className={clsx(
          "flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full",
          status === 'ready' && "bg-green-500/10 text-green-500",
          status === 'error' && "bg-red-500/10 text-red-500",
          status === 'warning' && "bg-orange-500/10 text-orange-500"
        )}>
          <div className="relative w-2 h-2">
            {status === 'ready' && <div className="status-ring text-green-500" />}
            <div className="status-dot w-2 h-2 bg-current" />
          </div>
          {message}
        </div>
      </div>
    </div>
  );

  return (
    <div className="glass-panel rounded-2xl p-6 space-y-6 h-full">
      <h2 className="text-lg font-bold flex items-center gap-3">
        <div className="w-1 h-5 bg-gradient-to-b from-secondary to-blue-600 rounded-full" />
        System Health
      </h2>

      <div className="space-y-3">
        <StatusItem
          icon={Network}
          label="Network"
          value="Polygon Amoy"
          status={isNetworkReady ? 'ready' : account ? 'error' : 'warning'}
          message={isNetworkReady ? "Live" : account ? "Wrong Network" : "Disconnected"}
        />

        <StatusItem
          icon={Database}
          label="Database"
          value="Neon Postgres"
          status={isDbConnected ? 'ready' : 'error'}
          message={isDbConnected ? "Live" : "Offline"}
        />

        <StatusItem
          icon={FileCode2}
          label="Smart Contract"
          value={isContractConfigured ? "Configured" : "Missing Config"}
          status={isContractReady ? 'ready' : isContractConfigured ? 'warning' : 'error'}
          message={isContractReady ? "Ready" : isContractConfigured ? "Waiting..." : "Not Configured"}
        />
      </div>
      
      {(!isContractConfigured || !isDbConnected) && (
        <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20 text-xs text-yellow-600/90 flex gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>
            {!isContractConfigured && "Update CONTRACT_ADDRESS in client/src/hooks/use-web3.ts. "}
            {!isDbConnected && "Check VITE_DATABASE_URL environment variable."}
          </p>
        </div>
      )}
    </div>
  );
}
