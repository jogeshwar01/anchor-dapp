# Anchor CRUD Dapp

This is a on-chain CRUD dapp. It lets you create, read, update and delete entries on the solana blockchain and interact with the solana program via a UI.

### Debug

1. Deactivate features in Solana test validator

```
solana-test-validator --deactivate-feature <FEATURE_TO_DEACTIVATE_ID> --bpf-program <PROGRAM_ID>  target/deploy/anchor_dapp.so --reset
```

2. Solana: Computational budget exceeded

- Logs contain - 810 of 810 compute units utilised
- Can be done inside the program/frontend as well using increase compute budget instructions for that txn.

```
solana-test-validator --compute-unit-limit 500000     // can put value here - 500000 is an example
```

### Commands

- Anchor

```
anchor keys sync
anchor build
anchor deploy
```

- React

```
npm run dev
```

- Solana test validator

```
solana-test-validator --compute-unit-limit 500000
```

- To check program account pubkey or balance

```
solana-keygen pubkey target/deploy/anchor_dapp-keypair.json
solana balance $(solana-keygen pubkey target/deploy/anchor_dapp-keypair.json)
```

## Getting Started

This project is generated with the [create-solana-dapp](https://github.com/solana-developers/create-solana-dapp) generator.

### Prerequisites

- Node v18.18.0 or higher

- Rust v1.70.0 or higher
- Anchor CLI 0.29.0 or higher
- Solana CLI 1.17.0 or higher

### Installation

#### Clone the repo

```shell
git clone <repo-url>
cd <repo-name>
```

#### Install Dependencies

```shell
npm install
```

#### Start the web app

```
npm run dev
```

## Apps

### anchor

This is a Solana program written in Rust using the Anchor framework.

#### Commands

You can use any normal anchor commands. Either move to the `anchor` directory and run the `anchor` command or prefix the command with `npm run`, eg: `npm run anchor`.

#### Sync the program id:

Running this command will create a new keypair in the `anchor/target/deploy` directory and save the address to the Anchor config file and update the `declare_id!` macro in the `./src/lib.rs` file of the program.

You will manually need to update the constant in `anchor/lib/counter-exports.ts` to match the new program id.

```shell
npm run anchor keys sync
```

#### Build the program:

```shell
npm run anchor-build
```

#### Start the test validator with the program deployed:

```shell
npm run anchor-localnet
```

#### Run the tests

```shell
npm run anchor-test
```

#### Deploy to Devnet

```shell
npm run anchor deploy --provider.cluster devnet
```

### web

This is a React app that uses the Anchor generated client to interact with the Solana program.

#### Commands

Start the web app

```shell
npm run dev
```

Build the web app

```shell
npm run build
```
