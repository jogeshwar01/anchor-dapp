// Here we export some useful types and functions for interacting with the Anchor program.
import { Cluster, PublicKey } from '@solana/web3.js';
import type { AnchorDapp } from '../target/types/anchor_dapp';
import { IDL as AnchorDappIDL } from '../target/types/anchor_dapp';

// Re-export the generated IDL and type
export { AnchorDapp, AnchorDappIDL };

// After updating your program ID (e.g. after running `anchor keys sync`) update the value below.
export const ANCHOR_DAPP_PROGRAM_ID = new PublicKey(
  '6K3vKSaZZhc1bsn8NA4yzp1QgjQBXaFAHQaBD476SnwU'
);

// This is a helper function to get the program ID for the AnchorDapp program depending on the cluster.
export function getAnchorDappProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return ANCHOR_DAPP_PROGRAM_ID;
  }
}
