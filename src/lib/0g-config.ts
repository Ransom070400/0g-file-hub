// // 0G Network Configuration
// // Using testnet endpoints - switch to mainnet when ready for production

// export const ZG_CONFIG = {
//   // EVM RPC endpoint for 0G chain
//   evmRpc: "https://evmrpc-testnet.0g.ai",

//   // Indexer RPC for storage operations (turbo for faster uploads)
//   indexerRpc: "https://indexer-storage-testnet-turbo.0g.ai",

//   // Chain ID for 0G testnet
//   chainId: 16602,

//   // Network name for MetaMask
//   networkName: "0G Testnet",

//   // Block explorer
//   blockExplorer: "https://chainscan-galileo.0g.ai",

//   // Native currency
//   nativeCurrency: {
//     name: "0G",
//     symbol: "0G",
//     decimals: 18,
//   },
// } as const;

// // Helper to add 0G network to MetaMask
// export async function addNetworkToMetaMask(): Promise<boolean> {
//   if (!window.ethereum) return false;

//   try {
//     await window.ethereum.request({
//       method: "wallet_addEthereumChain",
//       params: [
//         {
//           chainId: `0x${ZG_CONFIG.chainId.toString(16)}`,
//           chainName: ZG_CONFIG.networkName,
//           nativeCurrency: ZG_CONFIG.nativeCurrency,
//           rpcUrls: [ZG_CONFIG.evmRpc],
//           blockExplorerUrls: [ZG_CONFIG.blockExplorer],
//         },
//       ],
//     });
//     return true;
//   } catch (error) {
//     console.error("Failed to add network:", error);
//     return false;
//   }
// }

// // Helper to switch to 0G network
// export async function switchToNetwork(): Promise<boolean> {
//   if (!window.ethereum) return false;

//   try {
//     await window.ethereum.request({
//       method: "wallet_switchEthereumChain",
//       params: [{ chainId: `0x${ZG_CONFIG.chainId.toString(16)}` }],
//     });
//     return true;
//   } catch (error: any) {
//     // If chain not added, try to add it
//     if (error.code === 4902) {
//       return addNetworkToMetaMask();
//     }
//     console.error("Failed to switch network:", error);
//     return false;
//   }
// }


// 0G Network Configuration
// Using testnet endpoints - switch to mainnet when ready for production

export const ZG_CONFIG = {
  // EVM RPC endpoint for 0G chain
  evmRpc: "https://evmrpc-testnet.0g.ai",

  // Indexer RPC for storage operations (turbo for faster uploads)
  indexerRpc: "https://indexer-storage-testnet-turbo.0g.ai",

  // Chain ID for 0G testnet
  chainId: 16602, // Updated to 16600 (try this if 16602 doesn't work)

  // Network name for MetaMask
  networkName: "0G Newton Testnet",

  // Block explorer
  blockExplorer: "https://chainscan-galileo.0g.ai",

  // Native currency
  nativeCurrency: {
    name: "0G",
    symbol: "0G",
    decimals: 18,
  },
} as const;

// Alternative configuration to try if the above doesn't work
export const ZG_CONFIG_ALT = {
  evmRpc: "https://evmrpc-testnet.0g.ai",
  indexerRpc: "https://indexer-storage-testnet-turbo.0g.ai",
  chainId: 16602, // Galileo testnet
  networkName: "0G Galileo Testnet",
  blockExplorer: "https://chainscan-galileo.0g.ai",
  nativeCurrency: {
    name: "0G",
    symbol: "0G",
    decimals: 18,
  },
} as const;

// Helper to add 0G network to MetaMask
export async function addNetworkToMetaMask(): Promise<boolean> {
  if (!window.ethereum) return false;

  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: `0x${ZG_CONFIG.chainId.toString(16)}`,
          chainName: ZG_CONFIG.networkName,
          nativeCurrency: ZG_CONFIG.nativeCurrency,
          rpcUrls: [ZG_CONFIG.evmRpc],
          blockExplorerUrls: [ZG_CONFIG.blockExplorer],
        },
      ],
    });
    return true;
  } catch (error) {
    console.error("Failed to add network:", error);
    return false;
  }
}

// Helper to switch to 0G network
export async function switchToNetwork(): Promise<boolean> {
  if (!window.ethereum) return false;

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${ZG_CONFIG.chainId.toString(16)}` }],
    });
    return true;
  } catch (error: any) {
    // If chain not added, try to add it
    if (error.code === 4902) {
      return addNetworkToMetaMask();
    }
    console.error("Failed to switch network:", error);
    return false;
  }
}

// Export current chain ID in hex for easy reference
export const CHAIN_ID_HEX = `0x${ZG_CONFIG.chainId.toString(16)}`;

console.log("0G Config loaded:");
console.log("Chain ID:", ZG_CONFIG.chainId, `(${CHAIN_ID_HEX})`);
console.log("RPC:", ZG_CONFIG.evmRpc);
console.log("Indexer:", ZG_CONFIG.indexerRpc);