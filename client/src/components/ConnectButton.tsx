import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConnectButtonProps {
  account: string | null;
  isConnecting: boolean;
  onConnect: () => void;
}

export function ConnectButton({ account, isConnecting, onConnect }: ConnectButtonProps) {
  if (account) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="font-mono text-sm font-medium text-primary-foreground">
          {account.slice(0, 6)}...{account.slice(-4)}
        </span>
      </div>
    );
  }

  return (
    <Button 
      onClick={onConnect} 
      disabled={isConnecting}
      className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/20 rounded-xl transition-all hover:scale-105 active:scale-95 font-semibold"
    >
      {isConnecting ? (
        <>Connecting...</>
      ) : (
        <>
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </>
      )}
    </Button>
  );
}
