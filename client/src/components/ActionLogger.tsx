import { useState } from "react";
import { Send, Activity, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ActionLoggerProps {
  onLog: (text: string) => Promise<boolean>;
  isPending: boolean;
  disabled: boolean;
}

export function ActionLogger({ onLog, isPending, disabled }: ActionLoggerProps) {
  const [input, setInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const success = await onLog(input);
    if (success) {
      setInput("");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8 shadow-2xl neon-glow"
    >
      <div className="absolute top-0 right-0 -mt-12 -mr-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-primary/15 text-primary border border-primary/20">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Log Onchain Action</h2>
            <p className="text-muted-foreground text-sm">Record a permanent message on the blockchain</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground ml-1">Message Content</label>
            <div className="relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hello Wave 5..."
                className="pl-4 pr-12 py-6 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 text-lg rounded-xl transition-all"
                disabled={disabled || isPending}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={disabled || isPending || !input.trim()}
            className="w-full py-6 text-lg font-semibold rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.99]"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing Transaction...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Send Transaction</span>
                <Send className="w-5 h-5" />
              </div>
            )}
          </Button>

          {disabled && (
            <p className="text-center text-sm text-yellow-500/80 bg-yellow-500/10 py-2 rounded-lg border border-yellow-500/20">
              Please connect your wallet to interact
            </p>
          )}
        </form>
      </div>
    </motion.div>
  );
}
