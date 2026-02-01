import { useWeb3 } from "@/hooks/use-web3";
import { Loader2, Wallet, LogOut } from "lucide-react";
import { clsx } from "clsx";

export function ConnectButton() {
  const { account, connectWallet, isConnecting, error } = useWeb3();

  if (account) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden md:block text-right">
          <p className="text-xs text-muted-foreground">Connected</p>
          <p className="text-sm font-mono font-medium text-foreground">
            {account.slice(0, 6)}...{account.slice(-4)}
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary p-[1px]">
           <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
             <Wallet className="w-5 h-5 text-primary" />
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end">
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className={clsx(
          "px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2",
          "bg-white/10 hover:bg-white/15 text-white border border-white/5",
          "hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:border-primary/50",
          isConnecting && "opacity-75 cursor-wait"
        )}
      >
        {isConnecting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </>
        )}
      </button>
      {error && (
        <span className="text-xs text-red-400 mt-1 absolute top-full right-0">
          {error}
        </span>
      )}
    </div>
  );
}
