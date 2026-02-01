import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { ConnectButton } from "./ConnectButton";
import { useWeb3 } from "@/hooks/use-web3";
import { clsx } from "clsx";
import { Activity, LayoutDashboard, Hexagon, Wifi } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { account, chainId } = useWeb3();

  // Network Status Logic
  // Polygon Amoy Chain ID is 80002
  const isAmoy = chainId == "80002";
  const isLive = account && isAmoy;

  const navItems = [
    { label: "Dashboard", path: "/", icon: LayoutDashboard },
    { label: "Activity", path: "/activity", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2 group cursor-default">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/40 blur-lg rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                <Hexagon className="w-8 h-8 text-primary relative z-10" />
              </div>
              <span className="font-bold text-xl tracking-tight">
                Neon<span className="text-primary">Ledger</span>
              </span>
            </div>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={clsx(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2",
                      isActive
                        ? "bg-white/5 text-primary shadow-[0_0_15px_rgba(139,92,246,0.1)] border border-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    <item.icon className={clsx("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground")} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Network LIVE Indicator */}
            <div className={clsx(
              "hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold tracking-wide transition-colors",
              isLive 
                ? "bg-green-500/10 border-green-500/20 text-green-500" 
                : "bg-muted/40 border-white/5 text-muted-foreground"
            )}>
              <div className="relative w-2 h-2">
                {isLive && <div className="status-ring text-green-500" />}
                <div className={clsx("status-dot w-2 h-2", isLive ? "text-green-500" : "text-muted-foreground bg-muted-foreground")} />
              </div>
              {isLive ? "LIVE · Polygon Amoy Testnet" : "DISCONNECTED"}
            </div>

            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-auto bg-card/20">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-4">
          <p>Frontend-only Web3 Architecture.</p>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
              Polygon Amoy
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Neon Postgres
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
