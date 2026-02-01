import { Wallet, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  account: string | null;
  onConnect: () => void;
  isConnecting: boolean;
}

export function Header({ account, onConnect, isConnecting }: HeaderProps) {
  const shortenAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-800 flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Link2 className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white font-sans">
              Neon Ledger
            </h1>
          </div>
          <p className="text-xs text-muted-foreground hidden sm:block mt-0.5">
            Real-Time Onchain Activity Indexer
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-xs font-medium text-secondary-foreground">Polygon Amoy Testnet</span>
          </div>

          <Button
            onClick={onConnect}
            disabled={!!account || isConnecting}
            className={`
              font-semibold transition-all duration-300
              ${account 
                ? "bg-muted/50 text-muted-foreground border border-border hover:bg-muted/70 cursor-default" 
                : "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5"
              }
            `}
          >
            {isConnecting ? (
              "Connecting..."
            ) : account ? (
              <span className="flex items-center gap-2 font-mono">
                <Wallet className="w-4 h-4" />
                {shortenAddress(account)}
              </span>
            ) : (
              "Connect Wallet"
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
