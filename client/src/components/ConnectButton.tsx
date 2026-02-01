import { useWeb3 } from "@/hooks/use-web3";
import { Wallet, Loader2, AlertCircle } from "lucide-react";
import { clsx } from "clsx";

export function ConnectButton() {
  const { account, connectWallet, isConnecting, error } = useWeb3();

  if (error) {
    return (
      <button
        onClick={connectWallet}
        className="px-4 py-2 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors flex items-center gap-2 text-sm font-medium"
      >
        <AlertCircle className="w-4 h-4" />
        MetaMask Error
      </button>
    );
  }

  if (account) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary font-mono text-sm shadow-[0_0_15px_rgba(139,92,246,0.15)]">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        {account.slice(0, 6)}...{account.slice(-4)}
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      disabled={isConnecting}
      className={clsx(
        "px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300",
        "bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/20",
        "hover:shadow-primary/40 hover:-translate-y-0.5",
        "active:translate-y-0 active:shadow-md",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        "flex items-center gap-2"
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
  );
}
