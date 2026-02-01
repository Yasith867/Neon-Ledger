import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

// Placeholder contract address - User should replace this with their deployed contract
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";
const CONTRACT_ABI = [
  "function log(string action)",
  "event ActionLogged(address indexed user, string action)"
];

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useWeb3() {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await browserProvider.send("eth_requestAccounts", []);
      const network = await browserProvider.getNetwork();
      
      setAccount(accounts[0]);
      setProvider(browserProvider);
      setChainId(network.chainId.toString());

      const signer = await browserProvider.getSigner();
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(contractInstance);

    } catch (err: any) {
      console.error("Failed to connect wallet:", err);
      setError(err.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Auto-connect if permission already granted
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await browserProvider.listAccounts();
        if (accounts.length > 0) {
          connectWallet();
        }
      }
    };
    checkConnection();
  }, [connectWallet]);

  // Handle account/network changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          setAccount(null);
          setContract(null);
        } else {
          setAccount(accounts[0]);
          connectWallet(); // Re-initialize provider/signer
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, [connectWallet]);

  return {
    account,
    provider,
    contract,
    chainId,
    isConnecting,
    error,
    connectWallet
  };
}
