import { useState } from "react";
import { useWeb3 } from "@/hooks/use-web3";
import { ethers } from "ethers";
import EventLoggerArtifact from "@/contracts/EventLogger.json";
import { Rocket, Loader2, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Deployer() {
  const { provider, chainId, isContractConfigured } = useWeb3();
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedAddress, setDeployedAddress] = useState<string | null>(null);
  const { toast } = useToast();
  
  const isAmoy = chainId == "80002";

  // If already configured, we don't need to show this component prominently
  // Or we can just hide it completely.
  if (isContractConfigured) return null;
  if (!isAmoy) return null;

  const handleDeploy = async () => {
    if (!provider) return;
    
    setIsDeploying(true);
    try {
      const signer = await provider.getSigner();
      const factory = new ethers.ContractFactory(
        EventLoggerArtifact.abi,
        EventLoggerArtifact.bytecode,
        signer
      );

      toast({
        title: "Deploying Contract",
        description: "Please confirm the transaction in MetaMask...",
      });

      const contract = await factory.deploy();
      await contract.waitForDeployment();
      const address = await contract.getAddress();
      
      setDeployedAddress(address);
      toast({
        title: "Deployment Successful!",
        description: "Contract deployed at " + address,
        variant: "default",
      });

    } catch (error: any) {
      console.error("Deployment failed:", error);
      toast({
        title: "Deployment Failed",
        description: error.message || "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const copyToClipboard = () => {
    if (deployedAddress) {
      navigator.clipboard.writeText(deployedAddress);
      toast({ description: "Address copied to clipboard" });
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-8 relative overflow-hidden group">
      {/* Background glow effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 group-hover:bg-primary/20 transition-colors" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-lg">
          <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm">
            <Rocket className="w-4 h-4" />
            <span>Deployer</span>
          </div>
          <h2 className="text-2xl font-bold">Deploy EventLogger Contract</h2>
          <p className="text-muted-foreground">
            Your contract is not configured yet. Deploy a fresh instance to Polygon Amoy to get started.
          </p>
        </div>

        {!deployedAddress ? (
          <button
            onClick={handleDeploy}
            disabled={isDeploying}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 whitespace-nowrap"
          >
            {isDeploying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deploying...
              </>
            ) : (
              "Deploy Contract"
            )}
          </button>
        ) : (
          <div className="bg-background/50 border border-green-500/30 rounded-xl p-4 w-full md:w-auto min-w-[300px] animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-500 font-semibold flex items-center gap-2">
                <Check className="w-4 h-4" /> Success!
              </span>
              <button 
                onClick={copyToClipboard}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <Copy className="w-3 h-3" /> Copy
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-1">New Contract Address:</p>
            <code className="block bg-black/30 rounded px-2 py-1.5 font-mono text-sm text-green-400 break-all border border-green-500/20">
              {deployedAddress}
            </code>
            <div className="mt-3 p-2 rounded bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-200/80">
              <strong>Action Required:</strong> Copy this address and update <code>CONTRACT_ADDRESS</code> in <code>client/src/hooks/use-web3.ts</code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
