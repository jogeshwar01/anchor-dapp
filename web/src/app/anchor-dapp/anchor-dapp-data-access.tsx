import { AnchorDappIDL, getAnchorDappProgramId } from '@anchor-dapp/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

export function useAnchorDappProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getAnchorDappProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = new Program(AnchorDappIDL, programId, provider);

  const accounts = useQuery({
    queryKey: ['anchor-dapp', 'all', { cluster }],
    queryFn: () => program.account.anchorDapp.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initialize = useMutation({
    mutationKey: ['anchor-dapp', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods
        .initialize()
        .accounts({ anchorDapp: keypair.publicKey })
        .signers([keypair])
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to initialize account'),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  };
}

export function useAnchorDappProgramAccount({
  account,
}: {
  account: PublicKey;
}) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useAnchorDappProgram();

  const accountQuery = useQuery({
    queryKey: ['anchor-dapp', 'fetch', { cluster, account }],
    queryFn: () => program.account.anchorDapp.fetch(account),
  });

  const closeMutation = useMutation({
    mutationKey: ['anchor-dapp', 'close', { cluster, account }],
    mutationFn: () =>
      program.methods.close().accounts({ anchorDapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },
  });

  const decrementMutation = useMutation({
    mutationKey: ['anchor-dapp', 'decrement', { cluster, account }],
    mutationFn: () =>
      program.methods.decrement().accounts({ anchorDapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const incrementMutation = useMutation({
    mutationKey: ['anchor-dapp', 'increment', { cluster, account }],
    mutationFn: () =>
      program.methods.increment().accounts({ anchorDapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const setMutation = useMutation({
    mutationKey: ['anchor-dapp', 'set', { cluster, account }],
    mutationFn: (value: number) =>
      program.methods.set(value).accounts({ anchorDapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  };
}
