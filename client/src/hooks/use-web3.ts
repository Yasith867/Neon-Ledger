import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useToast } from './use-toast';
import { useEvents } from './use-events';

// Declare window interface for Ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Configuration
const CONTRACT_ADDRESS = "0x41e05d9571D22C1eA6063b7159d4e510A512d7c5"; // Replace with your actual contract address
const CHAIN_ID = '0x13882'; // Polygon Amoy Testnet (80002)

const CONTRACT_ABI = [
  "function log(string action)",
  "event ActionLogged(address indexed user, string action)"
];

export function useWeb3() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();
  const { insertEvent } = useEvents();

  // Check if wallet is connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0].address);
          }
        } catch (err) {
          console.error("Failed to check wallet connection", err);
        }
      }
    };
    checkConnection();
  }, []);

  // Listen for contract events
  useEffect(() => {
    if (!window.ethereum || !account) return;

    let contract: ethers.Contract;

    const setupListener = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        // We use a provider (read-only) to listen to events, 
        // but often it's better to use a websocket provider or similar for reliability.
        // For MetaMask provider, this works for simple cases.
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

        // Define the event filter/listener
        const onActionLogged = (user: string, action: string) => {
          console.log("Event detected from blockchain:", user, action);
          
          // Only insert if WE initiated it or if we want to index everything.
          // Since this is a frontend-only demo, every connected client will try to insert.
          // To prevent duplicates in a real app, usually a backend indexer handles this.
          // For this demo, we'll just insert. The DB logic is simple.
          insertEvent(user, action);
          
          toast({
            title: "Blockchain Event Confirmed",
            description: `Action logged: ${action}`,
          });
        };

        contract.on("ActionLogged", onActionLogged);

        return () => {
          contract.off("ActionLogged", onActionLogged);
        };
      } catch (err) {
        console.error("Setup listener error:", err);
      }
    };

    setupListener();
  }, [account, insertEvent, toast]);

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to interact with this app.",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      // Switch network if needed
      const network = await provider.getNetwork();
      if (network.chainId !== BigInt(parseInt(CHAIN_ID, 16))) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: CHAIN_ID }],
          });
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: CHAIN_ID,
                  chainName: 'Polygon Amoy Testnet',
                  rpcUrls: ['https://rpc-amoy.polygon.technology/'],
                  blockExplorerUrls: ['https://amoy.polygonscan.com/'],
                  nativeCurrency: {
                    name: 'MATIC',
                    symbol: 'MATIC', 
                    decimals: 18
                  }
                },
              ],
            });
          } else {
            throw switchError;
          }
        }
      }
      
      setAccount(accounts[0]);
      toast({
        title: "Wallet Connected",
        description: "You can now interact with the blockchain.",
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Connection Failed",
        description: err.message || "Failed to connect wallet",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const logAction = async (actionText: string) => {
    if (!account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first.",
        variant: "destructive"
      });
      return false;
    }

    if (!actionText.trim()) {
      toast({
        title: "Empty Input",
        description: "Please enter an action to log.",
        variant: "destructive"
      });
      return false;
    }

    setIsPending(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.log(actionText);
      console.log("Transaction sent:", tx.hash);
      
      toast({
        title: "Transaction Sent",
        description: "Waiting for confirmation...",
      });

      await tx.wait();
      
      // Note: The event listener above will handle the success notification and DB insertion
      return true;
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Transaction Failed",
        description: err.reason || err.message || "Failed to send transaction",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsPending(false);
    }
  };

  return {
    account,
    connectWallet,
    isConnecting,
    logAction,
    isPending
  };
}
