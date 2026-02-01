import { useState } from "react";
import { useWeb3 } from "@/hooks/use-web3";
import { useEvents } from "@/hooks/use-events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Terminal, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ActionLogger() {
  const [actionText, setActionText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { contract, isContractConfigured, account, chainId } = useWeb3();
  const { insertEvent } = useEvents();
  const { toast } = useToast();

  const handleLogAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !actionText.trim() || !account) return;

    setIsProcessing(true);
    try {
      // 1. Send transaction to blockchain
      const tx = await contract.log(actionText);
      
      toast({
        title: "Transaction Sent",
        description: "Waiting for confirmation on Polygon Amoy...",
      });

      // 2. Wait for confirmation
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        // 3. Log to Neon Database
        // Note: In a real production app, we would use a backend listener.
        // For this frontend-only demo, we insert directly after confirmation.
        await insertEvent(account, actionText);
        
        toast({
          title: "Success!",
          description: "Action logged on-chain and indexed to Neon.",
          className: "bg-green-500/10 border-green-500/20 text-green-500"
        });
        
        setActionText("");
      } else {
        throw new Error("Transaction failed");
      }
    } catch (err: any) {
      console.error("Transaction Error:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to log action",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const isReady = isContractConfigured && !!contract && chainId === "80002";

  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <Terminal className="w-32 h-32 text-primary rotate-12" />
      </div>

      <div className="relative z-10 space-y-2">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <div className="w-1 h-6 bg-gradient-to-b from-primary to-purple-600 rounded-full" />
          Log Onchain Action
        </h2>
        <p className="text-muted-foreground text-sm max-w-md">
          Interact with the Polygon Amoy blockchain. This transaction will be indexed to your Neon Postgres database.
        </p>
      </div>

      <form onSubmit={handleLogAction} className="relative z-10 space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">
            Action Message
          </label>
          <div className="relative">
            <Input
              value={actionText}
              onChange={(e) => setActionText(e.target.value)}
              placeholder="e.g., Hello Wave 5"
              className="bg-background/50 border-white/10 h-12 pl-4 pr-12 focus:border-primary/50 focus:ring-primary/20 transition-all font-mono text-sm"
              disabled={!isReady || isProcessing}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className={`w-2 h-2 rounded-full ${actionText ? 'bg-primary animate-pulse' : 'bg-muted'}`} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            type="submit" 
            disabled={!isReady || isProcessing || !actionText.trim()}
            className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 h-12 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Confirming Transaction...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Log Transaction
              </>
            )}
          </Button>
        </div>

        {!isReady && (
          <p className="text-center text-xs text-yellow-500/80 bg-yellow-500/5 py-2 rounded-lg border border-yellow-500/10">
            {!account 
              ? "Connect wallet to interact" 
              : !isContractConfigured 
                ? "Contract not configured" 
                : "Switch to Polygon Amoy Testnet"}
          </p>
        )}
      </form>
    </div>
  );
}
