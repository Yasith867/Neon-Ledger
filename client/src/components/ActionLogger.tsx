import { useState } from "react";
import { useWeb3 } from "@/hooks/use-web3";
import { useEvents } from "@/hooks/use-events";
import { Send, Loader2, Terminal } from "lucide-react";
import { clsx } from "clsx";

export function ActionLogger() {
  const { contract, account } = useWeb3();
  const { insertEvent } = useEvents();
  const [actionText, setActionText] = useState("");
  const [isMining, setIsMining] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !actionText.trim()) return;

    setIsMining(true);
    setStatus("idle");

    try {
      // 1. Send Transaction to Polygon
      const tx = await contract.log(actionText);
      console.log("Transaction sent:", tx.hash);

      // 2. Wait for confirmation
      await tx.wait();
      
      // 3. Log to Neon DB (Optimistic update or after confirm)
      if (account) {
        await insertEvent(account, actionText);
      }

      setStatus("success");
      setActionText("");
      
      // Reset success status after 3s
      setTimeout(() => setStatus("idle"), 3000);

    } catch (err) {
      console.error("Transaction failed:", err);
      setStatus("error");
    } finally {
      setIsMining(false);
    }
  };

  const isDisabled = !contract || isMining || !actionText.trim();

  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8 h-full flex flex-col justify-between relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Log Onchain Action</h2>
            <p className="text-sm text-muted-foreground">Interact with the smart contract</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Action Message
            </label>
            <input
              type="text"
              value={actionText}
              onChange={(e) => setActionText(e.target.value)}
              placeholder={contract ? "e.g., Hello World" : "Please connect wallet first"}
              disabled={!contract || isMining}
              className={clsx(
                "w-full px-4 py-3 rounded-xl bg-background border-2 border-border/50 transition-all duration-200",
                "focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none",
                "placeholder:text-muted-foreground/50",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            />
          </div>

          <button
            type="submit"
            disabled={isDisabled}
            className={clsx(
              "w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200",
              status === "success" 
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-primary hover:bg-primary/90 text-primary-foreground",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary shadow-lg shadow-black/20"
            )}
          >
            {isMining ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing Transaction...
              </>
            ) : status === "success" ? (
              "Success! Action Logged"
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Transaction
              </>
            )}
          </button>
        </form>
      </div>

      {!contract && (
        <div className="mt-6 p-4 rounded-xl bg-secondary/5 border border-secondary/10 text-secondary text-sm flex items-start gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
          <p>Connect your wallet to interact with the Polygon Amoy testnet contract.</p>
        </div>
      )}
    </div>
  );
}
