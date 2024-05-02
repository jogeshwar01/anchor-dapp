import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';
import { AnchorDapp } from '../target/types/anchor_dapp';

describe('anchor-dapp', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.AnchorDapp as Program<AnchorDapp>;

  const anchorDappKeypair = Keypair.generate();

  it('Initialize AnchorDapp', async () => {
    await program.methods
      .initialize()
      .accounts({
        anchorDapp: anchorDappKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([anchorDappKeypair])
      .rpc();

    const currentCount = await program.account.anchorDapp.fetch(
      anchorDappKeypair.publicKey
    );

    expect(currentCount.count).toEqual(0);
  });

  it('Increment AnchorDapp', async () => {
    await program.methods
      .increment()
      .accounts({ anchorDapp: anchorDappKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.anchorDapp.fetch(
      anchorDappKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Increment AnchorDapp Again', async () => {
    await program.methods
      .increment()
      .accounts({ anchorDapp: anchorDappKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.anchorDapp.fetch(
      anchorDappKeypair.publicKey
    );

    expect(currentCount.count).toEqual(2);
  });

  it('Decrement AnchorDapp', async () => {
    await program.methods
      .decrement()
      .accounts({ anchorDapp: anchorDappKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.anchorDapp.fetch(
      anchorDappKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Set anchorDapp value', async () => {
    await program.methods
      .set(42)
      .accounts({ anchorDapp: anchorDappKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.anchorDapp.fetch(
      anchorDappKeypair.publicKey
    );

    expect(currentCount.count).toEqual(42);
  });

  it('Set close the anchorDapp account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        anchorDapp: anchorDappKeypair.publicKey,
      })
      .rpc();

    // The account should no longer exist, returning null.
    const userAccount = await program.account.anchorDapp.fetchNullable(
      anchorDappKeypair.publicKey
    );
    expect(userAccount).toBeNull();
  });
});
