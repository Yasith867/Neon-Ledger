import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Zap, ExternalLink, Cuboid, Send } from "lucide-react";
import { useWeb3 } from "@/hooks/use-web3";
import { useEvents } from "@/hooks/use-events";
import { ConnectButton } from "@/components/ConnectButton";
import { EventFeed } from "@/components/EventFeed";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ethers } from "ethers";

export default function Home() {
  const { account, connect, isConnecting, isPending, logAction, getContract } = useWeb3();
  const { events, isLoading, dbError, insertEvent } = useEvents();
  const [customMessage, setCustomMessage] = useState("Hello Wave 5");
  
  // Use a ref to prevent duplicate listeners
  const listeningRef = useRef(false);

  // Setup event listener
  useEffect(() => {
    let contract: ethers.Contract | null = null;

    const setupListener = async () => {
      if (listeningRef.current) return;
      
      const c = await getContract();
      if (!c) return;
      
      contract = c;
      listeningRef.current = true;

      // Listen for ActionLogged events
      // ABI: event ActionLogged(address indexed user, string action)
      contract.on("ActionLogged", (user, action, event) => {
        console.log("Event detected:", user, action);
        // Insert into Neon Postgres
        insertEvent(user, action);
      });
    };

    setupListener();

    return () => {
      if (contract) {
        contract.removeAllListeners("ActionLogged");
        listeningRef.current = false;
      }
    };
  }, [getContract, insertEvent]);

  return (
    <div className="min-h-screen pb-20">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/25">
              <Cuboid className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                NeonWeb3
              </h1>
              <p className="text-sm text-muted-foreground">Frontend-Only dApp</p>
            </div>
          </div>
          <ConnectButton 
            account={account} 
            isConnecting={isConnecting} 
            onConnect={connect} 
          />
        </header>

        <main className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Interaction */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass-card p-1">
                <div className="p-6 rounded-xl bg-gradient-to-b from-white/5 to-transparent">
                  <h2 className="text-xl font-display font-bold mb-2 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Interact
                  </h2>
                  <p className="text-muted-foreground text-sm mb-6">
                    Call the <code className="text-primary bg-primary/10 px-1 rounded">log()</code> function on the smart contract. This will emit an event that gets indexed to Neon DB.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                        Message to Log
                      </label>
                      <Input
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        className="bg-black/20 border-white/10 text-white placeholder:text-white/20 h-12 rounded-xl focus:ring-primary/50"
                        placeholder="Enter a message..."
                      />
                    </div>

                    <Button
                      onClick={() => logAction(customMessage)}
                      disabled={!account || isPending}
                      className="w-full h-12 text-lg rounded-xl font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 transition-all"
                    >
                      {isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Confirming...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          Send Transaction
                        </div>
                      )}
                    </Button>

                    {!account && (
                      <p className="text-center text-xs text-yellow-500/80 bg-yellow-500/10 py-2 rounded-lg border border-yellow-500/20">
                        Connect wallet to interact
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-panel p-6 rounded-2xl"
            >
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-primary" />
                Technical Details
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Frontend directly connects to Neon Postgres via WebSocket-based driver.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Ethers.js listens for contract events in real-time.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>No backend API server is used. Logic runs entirely in client.</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Right Column: Feed */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <EventFeed events={events} isLoading={isLoading} error={dbError} />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
