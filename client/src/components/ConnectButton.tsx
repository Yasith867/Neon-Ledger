import { useWeb3 } from "@/hooks/use-web3";
import { Button } from "@/components/ui/button";
import { Loader2, Wallet, AlertTriangle } from "lucide-react";
import { clsx } from "clsx";

export function ConnectButton() {
  const { account, connectWallet, isConnecting, chainId, isContractConfigured } = useWeb3();

  // Polygon Amoy is 80002
  const isWrongNetwork = account && chainId !== "80002";

  if (account) {
    return (
      <div className="flex items-center gap-3">
        {isWrongNetwork && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            Switch to Amoy
          </div>
        )}
        
        <div className={clsx(
          "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm border shadow-sm transition-all",
          isWrongNetwork 
            ? "bg-destructive/10 border-destructive/20 text-destructive"
            : !isContractConfigured 
              ? "bg-orange-500/10 border-orange-500/20 text-orange-500" 
              : "bg-primary/10 border-primary/20 text-primary"
        )}>
          <Wallet className="w-4 h-4" />
          <span>
            {account.slice(0, 6)}...{account.slice(-4)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Button 
      onClick={connectWallet} 
      disabled={isConnecting}
      className={clsx(
        "bg-white text-black hover:bg-white/90 font-medium px-6 rounded-lg transition-all",
        "shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:-translate-y-0.5"
      )}
    >
      {isConnecting ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Connecting...
        </>
      ) : (
        "Connect Wallet"
      )}
    </Button>
  );
}
