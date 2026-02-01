import { useWeb3 } from "@/hooks/use-web3";
import { useEvents } from "@/hooks/use-events";
import { Header } from "@/components/Header";
import { ActionLogger } from "@/components/ActionLogger";
import { EventFeed } from "@/components/EventFeed";
import { ExternalLink } from "lucide-react";

export default function Home() {
  const { account, connectWallet, isConnecting, logAction, isPending } = useWeb3();
  const { events, isLoading, dbError } = useEvents();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background pointer-events-none" />
      
      <Header 
        account={account} 
        onConnect={connectWallet} 
        isConnecting={isConnecting} 
      />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-7xl mx-auto">
          
          {/* Left Column: Interaction */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.1]">
                Your Gateway to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  Decentralized Data
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                Interact with the Polygon Amoy blockchain and watch your data instantly sync to our serverless Neon database.
              </p>
            </div>

            <ActionLogger 
              onLog={logAction} 
              isPending={isPending} 
              disabled={!account}
            />

            {/* Quick Stats or Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-card/50 border border-border/50">
                <div className="text-sm text-muted-foreground mb-1">Network</div>
                <div className="font-semibold text-white flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Polygon Amoy
                </div>
              </div>
              <div className="p-4 rounded-xl bg-card/50 border border-border/50">
                <div className="text-sm text-muted-foreground mb-1">Database</div>
                <div className="font-semibold text-white flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Neon Postgres
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Feed */}
          <div className="lg:col-span-7">
            <EventFeed 
              events={events} 
              isLoading={isLoading} 
              error={dbError} 
            />
          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-border/30 bg-background/50 backdrop-blur-sm relative z-10 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2024 Neon Ledger. Frontend-only Architecture.</p>
          <div className="flex items-center gap-6">
            <a href="https://amoy.polygonscan.com/" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
              Explorer <ExternalLink className="w-3 h-3" />
            </a>
            <a href="https://neon.tech" target="_blank" rel="noreferrer" className="hover:text-secondary transition-colors flex items-center gap-1">
              Neon Tech <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
