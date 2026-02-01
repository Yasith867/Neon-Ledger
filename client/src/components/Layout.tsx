import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { ConnectButton } from "./ConnectButton";
import { clsx } from "clsx";
import { Activity, LayoutDashboard, Hexagon } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/", icon: LayoutDashboard },
    { label: "Activity", path: "/activity", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2 group">
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
                        ? "bg-white/5 text-primary shadow-[0_0_15px_rgba(139,92,246,0.1)]"
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

          <ConnectButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Frontend-only Web3 Architecture. Powered by Polygon Amoy & Neon Postgres.</p>
        </div>
      </footer>
    </div>
  );
}
