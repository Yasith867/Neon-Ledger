import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useToast } from './use-toast';

// Extend window object to include ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Configuration
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // Placeholder
const CONTRACT_ABI = [
  "function log(string action)",
  "event ActionLogged(address indexed user, string action)"
];

export function useWeb3() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

  const checkConnection = useCallback(async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0].address);
        }
      } catch (err) {
        console.error("Error checking connection:", err);
      }
    }
  }, []);

  useEffect(() => {
    checkConnection();
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || null);
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, [checkConnection]);

  const connect = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to use this app.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsConnecting(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      setAccount(await signer.getAddress());
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to MetaMask.",
      });
    } catch (err: any) {
      toast({
        title: "Connection Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const logAction = async (message: string) => {
    if (!account) return;

    try {
      setIsPending(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.log(message);
      
      toast({
        title: "Transaction Sent",
        description: "Waiting for confirmation...",
      });

      await tx.wait();

      toast({
        title: "Success!",
        description: "Action logged to the blockchain.",
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Transaction Failed",
        description: err.code === 'ACTION_REJECTED' ? 'User rejected transaction' : 'Failed to log action',
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  // Listener setup is handled in the main component to coordinate with DB inserts
  const getContract = async () => {
    if (!window.ethereum) return null;
    const provider = new ethers.BrowserProvider(window.ethereum);
    // Use provider for listening (read-only), signer for writing
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  };

  return {
    account,
    isConnecting,
    isPending,
    connect,
    logAction,
    getContract,
    CONTRACT_ADDRESS
  };
}
