import { useState } from "react";
import { useWeb3 } from "@/hooks/use-web3";
import { useEvents } from "@/hooks/use-events";
import { Loader2, Send, Activity, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";

export function ActionLogger() {
  const { contract, account, isContractConfigured, chainId } = useWeb3();
  const { insertEvent } = useEvents();
  const { toast } = useToast();
  
  const [actionText, setActionText] = useState("");
  const [isPending, setIsPending] = useState(false);

  const isAmoy = chainId == "80002";
  const canInteract = isContractConfigured && !!contract && isAmoy;

  const handleLogAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !actionText.trim() || !account) return;

    setIsPending(true);
    try {
      toast({
        title: "Initiating Transaction",
        description: "Please confirm in MetaMask...",
      });

      const tx = await contract.log(actionText);
      
      toast({
        title: "Transaction Sent",
        description: "Waiting for confirmation...",
      });

      await tx.wait();

      // Optimistic update or event listener handling
      // For this app, we also manually trigger the DB insert for immediate feedback
      // In a real app, the listener would handle this
      await insertEvent(account, actionText);

      toast({
        title: "Success!",
        description: "Action logged on-chain and indexed to database.",
        variant: "default",
      });
      
      setActionText("");
    } catch (error: any) {
      console.error("Tx failed:", error);
      toast({
        title: "Transaction Failed",
        description: error.reason || error.message || "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8 h-full flex flex-col relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-3xl rounded-full pointer-events-none" />

      <h2 className="text-xl font-bold mb-2 flex items-center gap-2 relative z-10">
        <Activity className="w-5 h-5 text-primary" />
        Log Onchain Action
      </h2>
      <p className="text-muted-foreground text-sm mb-6 relative z-10">
        Write a message to the blockchain. We'll listen for the event and index it to Neon Postgres.
      </p>

      <form onSubmit={handleLogAction} className="flex-1 flex flex-col gap-4 relative z-10">
        <div className="relative">
          <input
            type="text"
            value={actionText}
            onChange={(e) => setActionText(e.target.value)}
            placeholder="e.g., Hello Polygon!"
            disabled={!canInteract || isPending}
            className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all disabled:opacity-50"
          />
          <div className="absolute right-3 top-3.5 text-xs text-muted-foreground">
            string
          </div>
        </div>

        <button
          type="submit"
          disabled={!canInteract || isPending || !actionText.trim()}
          className="mt-auto w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Transaction
            </>
          )}
        </button>

        {!canInteract && (
          <div className="text-xs text-center text-yellow-500/80 bg-yellow-500/5 py-2 px-3 rounded-lg border border-yellow-500/10 flex items-center justify-center gap-2">
            <Info className="w-3 h-3" />
            {isContractConfigured 
              ? (!account ? "Connect wallet to interact" : "Switch to Polygon Amoy")
              : "Contract not configured"}
          </div>
        )}
      </form>
    </div>
  );
}
