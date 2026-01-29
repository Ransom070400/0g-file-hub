// import { useState, useCallback, useEffect } from "react";
// import { toast } from "sonner";
// import { BrowserProvider, Signer } from "ethers";
// import { Indexer, Blob as ZgBlob } from "@0glabs/0g-ts-sdk/browser";
// import { ZG_CONFIG, switchToNetwork } from "@/lib/0g-config";

// export interface StoredFile {
//   id: string;
//   name: string;
//   hash: string;
//   size: string;
//   uploadedAt: string;
//   txHash?: string;
// }

// // Local storage key for persisting files
// const STORAGE_KEY = "0g-stored-files";

// function loadStoredFiles(): StoredFile[] {
//   try {
//     const stored = localStorage.getItem(STORAGE_KEY);
//     return stored ? JSON.parse(stored) : [];
//   } catch {
//     return [];
//   }
// }

// function saveStoredFiles(files: StoredFile[]) {
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
// }

// function formatFileSize(bytes: number): string {
//   if (bytes === 0) return "0 Bytes";
//   const k = 1024;
//   const sizes = ["Bytes", "KB", "MB", "GB"];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
// }

// function formatTimeAgo(date: Date): string {
//   const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

//   if (seconds < 60) return "Just now";
//   if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
//   if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
//   return `${Math.floor(seconds / 86400)} days ago`;
// }

// export function useStorage() {
//   const [files, setFiles] = useState<StoredFile[]>(loadStoredFiles);
//   const [isConnected, setIsConnected] = useState(false);
//   const [walletAddress, setWalletAddress] = useState<string>();
//   const [signer, setSigner] = useState<Signer | null>(null);
//   const [indexer] = useState(() => new Indexer(ZG_CONFIG.indexerRpc));

//   // Check for existing connection on mount
//   useEffect(() => {
//     const checkConnection = async () => {
//       if (window.ethereum) {
//         try {
//           const provider = new BrowserProvider(window.ethereum);
//           const accounts = await provider.listAccounts();
//           if (accounts.length > 0) {
//             const signer = await provider.getSigner();
//             setIsConnected(true);
//             setWalletAddress(await signer.getAddress());
//             setSigner(signer);
//           }
//         } catch (error) {
//           console.log("No existing connection");
//         }
//       }
//     };
//     checkConnection();
//   }, []);

//   // Listen for account changes
//   useEffect(() => {
//     if (window.ethereum) {
//       const handleAccountsChanged = (accounts: string[]) => {
//         if (accounts.length === 0) {
//           setIsConnected(false);
//           setWalletAddress(undefined);
//           setSigner(null);
//         } else {
//           setWalletAddress(accounts[0]);
//         }
//       };

//       window.ethereum.on("accountsChanged", handleAccountsChanged);
//       return () => {
//         window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
//       };
//     }
//   }, []);
//   useEffect(() => {
//   if (!window.ethereum) return;

//   const handleChainChanged = () => {
//     window.location.reload();
//   };

//   window.ethereum.on("chainChanged", handleChainChanged);
//   return () => {
//     window.ethereum.removeListener("chainChanged", handleChainChanged);
//   };
// }, []);


//   const connectWallet = useCallback(async () => {
//     if (!window.ethereum) {
//       toast.error("Please install MetaMask to use this app");
//       return;
//     }

//     try {

//       await window.ethereum.request({ method: "eth_requestAccounts" });

//      const switched = await switchToNetwork();

//     if (!switched) return;
//       // const provider = new BrowserProvider(window.ethereum);

//       // Request account access
//       // await provider.send("eth_requestAccounts", []);

//       // Switch to 0G network
//       // const switched = await switchToNetwork();
//       // if (!switched) {
//       //   toast.error("Please switch to the 0G network");
//       //   return;
//       // }
//       const provider = new BrowserProvider(window.ethereum)

//       const signer = await provider.getSigner();
//       const address = await signer.getAddress();

//       setIsConnected(true);
//       setWalletAddress(address);
//       setSigner(signer);

//       toast.success("Wallet connected successfully!");
//     } catch (error: any) {
//       console.error("Connection error:", error);
//       toast.error(error.message || "Failed to connect wallet");
//     }
//   }, []);


//   const uploadFile = useCallback(async (file: File) => {
//     if (!signer) {
//       toast.error("Please connect your wallet first");
//       throw new Error("Wallet not connected");
//     }
// const balance = await signer.provider.getBalance(walletAddress!);
// console.log("0G balance:", balance.toString());

//     try {
//       // Create a Blob from the File for the SDK
//       const zgBlob = new ZgBlob(file);

//       // Get merkle tree to show root hash
//       const [tree, treeErr] = await zgBlob.merkleTree();
//       if (treeErr) {
//         throw new Error(`Failed to create merkle tree: ${treeErr}`);
//       }

//       const rootHash = tree!.rootHash();
//       toast.info(`Uploading to 0G Network... Hash: ${rootHash.slice(0, 10)}...`);

//       // Upload to 0G storage network
//       const [result, uploadErr] = await indexer.upload(
//         zgBlob,
//         ZG_CONFIG.evmRpc,
//         signer
//       );

//       if (uploadErr) {
//         throw new Error(`Upload failed: ${uploadErr}`);
//       }

//       const newFile: StoredFile = {
//         id: Date.now().toString(),
//         name: file.name,
//         hash: result!.rootHash,
//         size: formatFileSize(file.size),
//         uploadedAt: new Date().toISOString(),
//         txHash: result!.txHash,
//       };

//       setFiles((prev) => {
//         const updated = [newFile, ...prev];
//         saveStoredFiles(updated);
//         return updated;
//       });

//       toast.success(`${file.name} uploaded successfully!`, {
//         description: `TX: ${result!.txHash.slice(0, 10)}...`,
//       });
//     } catch (error: any) {
//       console.error("Upload error:", error);
//       toast.error(error.message || "Upload failed");
//       throw error;
//     }
//   }, [signer, indexer]);

//   const downloadByHash = useCallback(async (hash: string) => {
//     try {
//       // Normalize hash format
//       const normalizedHash = hash.startsWith("0x") ? hash : `0x${hash}`;

//       // Check if we have this file in our local list
//       const localFile = files.find(
//         (f) => f.hash.toLowerCase() === normalizedHash.toLowerCase()
//       );

//       toast.info(`Fetching file from 0G Network...`);

//       // Get file locations from the network
//       const locations = await indexer.getFileLocations(normalizedHash);

//       if (!locations || locations.length === 0) {
//         toast.error("File not found on the network");
//         return;
//       }

//       // In browser environment, we need to use the storage node directly
//       // The SDK's download method is designed for Node.js file system
//       // For browser, we'll fetch from the storage node's HTTP endpoint
//       const node = locations[0];
//       const downloadUrl = `http://${node.url}/file?root=${normalizedHash}`;

//       // Create a download link
//       const link = document.createElement("a");
//       link.href = downloadUrl;
//       link.download = localFile?.name || `0g-file-${normalizedHash.slice(0, 8)}`;
//       link.target = "_blank";

//       toast.success(`Starting download: ${localFile?.name || normalizedHash.slice(0, 16)}...`);

//       // Trigger download
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error: any) {
//       console.error("Download error:", error);
//       toast.error(error.message || "Failed to download file");
//     }
//   }, [files, indexer]);

//   const downloadFile = useCallback((file: StoredFile) => {
//     downloadByHash(file.hash);
//   }, [downloadByHash]);

//   // Refresh file list with time ago formatting
//   const refreshedFiles = files.map((f) => ({
//     ...f,
//     uploadedAt: formatTimeAgo(new Date(f.uploadedAt)),
//   }));

//   return {
//     files: refreshedFiles,
//     isConnected,
//     walletAddress,
//     connectWallet,
//     uploadFile,
//     downloadByHash,
//     downloadFile,
//   };
// }

// // Type declaration for window.ethereum
// declare global {
//   interface Window {
//     ethereum?: {
//       request: (args: { method: string; params?: any[] }) => Promise<any>;
//       on: (event: string, handler: (...args: any[]) => void) => void;
//       removeListener: (event: string, handler: (...args: any[]) => void) => void;
//     };
//   }
// }



import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { BrowserProvider, Signer } from "ethers";
import { Indexer, Blob as ZgBlob } from "@0glabs/0g-ts-sdk/browser";
import { ZG_CONFIG, switchToNetwork } from "@/lib/0g-config";

export interface StoredFile {
  id: string;
  name: string;
  hash: string;
  size: string;
  uploadedAt: string;
  txHash?: string;
}

// Local storage key for persisting files
const STORAGE_KEY = "0g-stored-files";

function loadStoredFiles(): StoredFile[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveStoredFiles(files: StoredFile[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

export function useStorage() {
  const [files, setFiles] = useState<StoredFile[]>(loadStoredFiles);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>();
  const [signer, setSigner] = useState<Signer | null>(null);
  const [indexer] = useState(() => new Indexer(ZG_CONFIG.indexerRpc));

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const provider = new BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            const signer = await provider.getSigner();
            setIsConnected(true);
            setWalletAddress(await signer.getAddress());
            setSigner(signer);
          }
        } catch (error) {
          console.log("No existing connection");
        }
      }
    };
    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setIsConnected(false);
          setWalletAddress(undefined);
          setSigner(null);
        } else {
          setWalletAddress(accounts[0]);
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      return () => {
        window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, []);

  // Listen for chain changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on("chainChanged", handleChainChanged);
    return () => {
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      toast.error("Please install MetaMask to use this app");
      return;
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const switched = await switchToNetwork();
      if (!switched) {
        toast.error("Failed to switch to 0G network");
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setIsConnected(true);
      setWalletAddress(address);
      setSigner(signer);

      toast.success("Wallet connected successfully!");
    } catch (error: any) {
      console.error("Connection error:", error);
      toast.error(error.message || "Failed to connect wallet");
    }
  }, []);
  const uploadFile = useCallback(async (file: File) => {
    if (!signer) {
      toast.error("Please connect your wallet first");
      throw new Error("Wallet not connected");
    }

    try {
      // 1. Verify network
      const network = await signer.provider.getNetwork();
      console.log("=== NETWORK INFO ===");
      console.log("Chain ID:", network.chainId.toString());
      console.log("Expected Chain ID:", ZG_CONFIG.chainId);

      if (Number(network.chainId) !== ZG_CONFIG.chainId) {
        toast.error(`Wrong network! Expected ${ZG_CONFIG.chainId}, got ${network.chainId}`);
        const switched = await switchToNetwork();
        if (!switched) throw new Error("Please switch to 0G Testnet manually");
        window.location.reload();
        return;
      }

      // 2. Check balance
      const balance = await signer.provider.getBalance(walletAddress!);
      const balanceInEther = Number(balance) / 1e18;

      console.log("=== WALLET INFO ===");
      console.log("Address:", walletAddress);
      console.log("Balance (wei):", balance.toString());
      console.log("Balance (0G):", balanceInEther.toFixed(6));

      if (balance === 0n) {
        toast.error("No 0G tokens in wallet", {
          description: "Get testnet tokens from https://faucet.0g.ai",
          duration: 8000,
        });
        throw new Error("No balance - visit faucet");
      }

      if (balanceInEther < 0.05) {
        toast.warning("Low balance detected", {
          description: `Only ${balanceInEther.toFixed(4)} 0G remaining. Get more from faucet.`,
          duration: 6000,
        });
      }

      // 3. File validation
      const MAX_SIZE = 10 * 1024 * 1024; // 10MB
      if (file.size > MAX_SIZE) {
        toast.error("File too large", {
          description: `Max: ${formatFileSize(MAX_SIZE)}, Your file: ${formatFileSize(file.size)}`,
        });
        throw new Error("File exceeds 10MB limit");
      }

      if (file.size === 0) {
        toast.error("Cannot upload empty file");
        throw new Error("File is empty");
      }

      // 4. Prepare blob
      toast.info("Preparing file for upload...");
      const zgBlob = new ZgBlob(file);
      const [tree, treeErr] = await zgBlob.merkleTree();
      if (treeErr) throw new Error(`Failed to create merkle tree: ${treeErr}`);

      const rootHash = tree!.rootHash();
      console.log("=== UPLOAD INFO ===");
      console.log("Root Hash:", rootHash);

      toast.info(`Uploading to 0G Network...`, { description: `Hash: ${rootHash.slice(0, 16)}...` });

      // 5. Upload (browser-safe, no gasPrice passed)
      const [result, uploadErr] = await indexer.upload(zgBlob, ZG_CONFIG.evmRpc, signer);

      if (uploadErr) {
        console.error("Primary indexer failed:", uploadErr);
        throw new Error(typeof uploadErr === "string" ? uploadErr : uploadErr?.message ?? "Upload failed");
      }

      console.log("=== UPLOAD SUCCESS ===");
      console.log("TX Hash:", result!.txHash);
      console.log("Root Hash:", result!.rootHash);

      // 6. Save file locally
      const newFile: StoredFile = {
        id: Date.now().toString(),
        name: file.name,
        hash: result!.rootHash,
        size: formatFileSize(file.size),
        uploadedAt: new Date().toISOString(),
        txHash: result!.txHash,
      };

      setFiles((prev) => {
        const updated = [newFile, ...prev];
        saveStoredFiles(updated);
        return updated;
      });

      toast.success(`${file.name} uploaded successfully!`, {
        description: `TX: ${result!.txHash.slice(0, 10)}...`,
        duration: 5000,
      });
    } catch (error: any) {
      console.error("=== UPLOAD ERROR ===", error);

      let errorMessage = "Upload failed";
      let errorDescription = error.message || "Unknown error occurred";

      if (error.code === 4001) {
        errorMessage = "Transaction cancelled";
        errorDescription = "You rejected the transaction in MetaMask";
      } else if (error.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient funds";
        errorDescription = "Not enough 0G tokens for gas. Visit faucet.";
      } else if (error.message?.includes("network")) {
        errorMessage = "Network error";
        errorDescription = "Check your connection to 0G Testnet";
      }

      toast.error(errorMessage, { description: errorDescription, duration: 6000 });
      throw error;
    }
  }, [signer, indexer, walletAddress]);


  // const uploadFile = useCallback(async (file: File) => {
  //   if (!signer) {
  //     toast.error("Please connect your wallet first");
  //     throw new Error("Wallet not connected");
  //   }

  //   try {
  //     // 1. Verify network
  //     const network = await signer.provider.getNetwork();
  //     console.log("=== NETWORK INFO ===");
  //     console.log("Chain ID:", network.chainId.toString());
  //     console.log("Expected Chain ID:", ZG_CONFIG.chainId);

  //     if (Number(network.chainId) !== ZG_CONFIG.chainId) {
  //       toast.error(`Wrong network! Expected ${ZG_CONFIG.chainId}, got ${network.chainId}`);
  //       const switched = await switchToNetwork();
  //       if (!switched) {
  //         throw new Error("Please switch to 0G Testnet manually");
  //       }
  //       // Reload to ensure we're on the correct network
  //       window.location.reload();
  //       return;
  //     }

  //     // 2. Check balance
  //     const balance = await signer.provider.getBalance(walletAddress!);
  //     const balanceInEther = Number(balance) / 1e18;

  //     console.log("=== WALLET INFO ===");
  //     console.log("Address:", walletAddress);
  //     console.log("Balance (wei):", balance.toString());
  //     console.log("Balance (0G):", balanceInEther.toFixed(6));

  //     if (balance === 0n) {
  //       toast.error("No 0G tokens in wallet", {
  //         description: "Get testnet tokens from https://faucet.0g.ai",
  //         duration: 8000,
  //       });
  //       throw new Error("No balance - visit faucet");
  //     }

  //     if (balanceInEther < 0.05) {
  //       toast.warning("Low balance detected", {
  //         description: `Only ${balanceInEther.toFixed(4)} 0G remaining. Get more from faucet.`,
  //         duration: 6000,
  //       });
  //     }

  //     // 3. File validation
  //     console.log("=== FILE INFO ===");
  //     console.log("File name:", file.name);
  //     console.log("File size:", file.size, "bytes");
  //     console.log("File type:", file.type);

  //     const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  //     if (file.size > MAX_SIZE) {
  //       toast.error("File too large", {
  //         description: `Max: ${formatFileSize(MAX_SIZE)}, Your file: ${formatFileSize(file.size)}`,
  //       });
  //       throw new Error("File exceeds 10MB limit");
  //     }

  //     if (file.size === 0) {
  //       toast.error("Cannot upload empty file");
  //       throw new Error("File is empty");
  //     }

  //     // 4. Check gas settings
  //     const feeData = await signer.provider.getFeeData();
  //     const gasPrice = feeData.gasPrice ?? 4_000_000_007n;
  //     console.log("=== GAS INFO ===");
  //     console.log("Gas Price:", feeData.gasPrice?.toString());
  //     console.log("Max Fee Per Gas:", feeData.maxFeePerGas?.toString());

  //     // 5. Create blob and get merkle tree
  //     toast.info("Preparing file for upload...");
  //     const zgBlob = new ZgBlob(file);

  //     const [tree, treeErr] = await zgBlob.merkleTree();
  //     if (treeErr) {
  //       console.error("Merkle tree error:", treeErr);
  //       throw new Error(`Failed to create merkle tree: ${treeErr}`);
  //     }

  //     const rootHash = tree!.rootHash();
  //     console.log("=== UPLOAD INFO ===");
  //     console.log("Root Hash:", rootHash);

  //     toast.info(`Uploading to 0G Network...`, {
  //       description: `Hash: ${rootHash.slice(0, 16)}...`,
  //     });

  //     // 6. Try primary indexer first
  //     console.log("Attempting upload with primary indexer...");
  //     const [result, uploadErr] = await indexer.upload(
  //       zgBlob,
  //       ZG_CONFIG.evmRpc,
  //       signer
  //     );

  //     if (uploadErr) {
  //       console.warn("Primary indexer failed:", uploadErr);
  //       toast.info("Trying alternative indexer...");

  //       // 7. Fallback to standard indexer
  //       try {
  //         console.log("Attempting upload with fallback indexer...");
  //         const fallbackIndexer = new Indexer("https://indexer-storage-testnet-standard.0g.ai");
  //         const [retryResult, retryErr] = await fallbackIndexer.upload(
  //           zgBlob,
  //           ZG_CONFIG.evmRpc,
  //           signer
  //         );

  //         if (retryErr) {
  //           console.error("Fallback indexer also failed:", retryErr);

  //           // Parse error for better message
  //           const errorMsg = typeof retryErr === "string" ? retryErr : (retryErr?.message ?? String(retryErr));

  //           if (errorMsg.includes("insufficient funds")) {
  //             throw new Error("Insufficient 0G tokens for gas fees. Get more from faucet.");
  //           } else if (errorMsg.includes("CALL_EXCEPTION") || errorMsg.includes("require(false)")) {
  //             // Extract contract info if available
  //             let details = "";
  //             try {
  //               const toMatch = errorMsg.match(/"to":\s*"(0x[0-9a-fA-F]+)"/);
  //               const dataMatch = errorMsg.match(/"data":\s*"(0x[0-9a-fA-F]+)"/);
  //               if (toMatch) details += `Contract: ${toMatch[1].slice(0, 10)}...`;
  //               if (dataMatch) details += ` Selector: ${dataMatch[1].slice(0, 10)}`;
  //             } catch {}

  //             throw new Error(`Contract rejected transaction. ${details || "Possible issues: contract paused, wrong network, or insufficient balance"}`);
  //           } else {
  //             throw new Error(`Upload failed: ${errorMsg}`);
  //           }
  //         }

  //         console.log("=== UPLOAD SUCCESS (FALLBACK) ===");
  //         console.log("TX Hash:", retryResult!.txHash);
  //         console.log("Root Hash:", retryResult!.rootHash);

  //         const newFile: StoredFile = {
  //           id: Date.now().toString(),
  //           name: file.name,
  //           hash: retryResult!.rootHash,
  //           size: formatFileSize(file.size),
  //           uploadedAt: new Date().toISOString(),
  //           txHash: retryResult!.txHash,
  //         };

  //         setFiles((prev) => {
  //           const updated = [newFile, ...prev];
  //           saveStoredFiles(updated);
  //           return updated;
  //         });

  //         toast.success(`${file.name} uploaded successfully!`, {
  //           description: `TX: ${retryResult!.txHash.slice(0, 10)}...`,
  //           duration: 5000,
  //         });
  //         return;
  //       } catch (fallbackError: any) {
  //         console.error("Fallback upload error:", fallbackError);
  //         throw fallbackError;
  //       }
  //     }

  //     // 8. Primary upload succeeded
  //     console.log("=== UPLOAD SUCCESS (PRIMARY) ===");
  //     console.log("TX Hash:", result!.txHash);
  //     console.log("Root Hash:", result!.rootHash);

  //     const newFile: StoredFile = {
  //       id: Date.now().toString(),
  //       name: file.name,
  //       hash: result!.rootHash,
  //       size: formatFileSize(file.size),
  //       uploadedAt: new Date().toISOString(),
  //       txHash: result!.txHash,
  //     };

  //     setFiles((prev) => {
  //       const updated = [newFile, ...prev];
  //       saveStoredFiles(updated);
  //       return updated;
  //     });

  //     toast.success(`${file.name} uploaded successfully!`, {
  //       description: `TX: ${result!.txHash.slice(0, 10)}...`,
  //       duration: 5000,
  //     });
  //   } catch (error: any) {
  //     console.error("=== UPLOAD ERROR ===");
  //     console.error("Error:", error);
  //     console.error("Error message:", error.message);
  //     console.error("Error code:", error.code);

  //     // User-friendly error messages
  //     let errorMessage = "Upload failed";
  //     let errorDescription = error.message || "Unknown error occurred";

  //     if (error.code === 4001) {
  //       errorMessage = "Transaction cancelled";
  //       errorDescription = "You rejected the transaction in MetaMask";
  //     } else if (error.message?.includes("insufficient funds")) {
  //       errorMessage = "Insufficient funds";
  //       errorDescription = "Not enough 0G tokens for gas. Visit faucet.";
  //     } else if (error.message?.includes("network")) {
  //       errorMessage = "Network error";
  //       errorDescription = "Check your connection to 0G Testnet";
  //     }

  //     toast.error(errorMessage, {
  //       description: errorDescription,
  //       duration: 6000,
  //     });

  //     throw error;
  //   }
  // }, [signer, indexer, walletAddress]);

  const downloadByHash = useCallback(async (hash: string) => {
    try {
      // Normalize hash format
      const normalizedHash = hash.startsWith("0x") ? hash : `0x${hash}`;

      // Check if we have this file in our local list
      const localFile = files.find(
        (f) => f.hash.toLowerCase() === normalizedHash.toLowerCase()
      );

      toast.info(`Fetching file from 0G Network...`);

      // Get file locations from the network
      const locations = await indexer.getFileLocations(normalizedHash);

      if (!locations || locations.length === 0) {
        toast.error("File not found on the network");
        return;
      }

      // In browser environment, we need to use the storage node directly
      // The SDK's download method is designed for Node.js file system
      // For browser, we'll fetch from the storage node's HTTP endpoint
      const node = locations[0];
      const downloadUrl = `http://${node.url}/file?root=${normalizedHash}`;

      // Create a download link
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = localFile?.name || `0g-file-${normalizedHash.slice(0, 8)}`;
      link.target = "_blank";

      toast.success(`Starting download: ${localFile?.name || normalizedHash.slice(0, 16)}...`);

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      console.error("Download error:", error);
      toast.error(error.message || "Failed to download file");
    }
  }, [files, indexer]);

  const downloadFile = useCallback((file: StoredFile) => {
    downloadByHash(file.hash);
  }, [downloadByHash]);

  // Refresh file list with time ago formatting
  const refreshedFiles = files.map((f) => ({
    ...f,
    uploadedAt: formatTimeAgo(new Date(f.uploadedAt)),
  }));

  return {
    files: refreshedFiles,
    isConnected,
    walletAddress,
    connectWallet,
    uploadFile,
    downloadByHash,
    downloadFile,
  };
}

// Type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, handler: (...args: any[]) => void) => void;
      removeListener: (event: string, handler: (...args: any[]) => void) => void;
    };
  }
}
