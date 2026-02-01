import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

// CRITICAL: User must replace this with their deployed contract address
export const CONTRACT_ADDRESS = "<SET_ME>";

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

  // Check if the user has actually set the contract address
  const isContractConfigured = CONTRACT_ADDRESS !== "<SET_ME>" && CONTRACT_ADDRESS.startsWith("0x");

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

      // Only init contract if configured
      if (isContractConfigured) {
        const signer = await browserProvider.getSigner();
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        setContract(contractInstance);
      }

    } catch (err: any) {
      console.error("Failed to connect wallet:", err);
      setError(err.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  }, [isContractConfigured]);

  const switchNetwork = useCallback(async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x13882" }], // 80002
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x13882",
                chainName: "Polygon Amoy Testnet",
                rpcUrls: ["https://rpc-amoy.polygon.technology"],
                nativeCurrency: {
                  name: "MATIC",
                  symbol: "MATIC",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://amoy.polygonscan.com"],
              },
            ],
          });
        } catch (addError) {
          console.error("Failed to add Amoy network:", addError);
        }
      } else {
        console.error("Failed to switch to Amoy network:", switchError);
      }
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
    connectWallet,
    switchNetwork,
    isContractConfigured
  };
}
