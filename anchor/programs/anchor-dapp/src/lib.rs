#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("6K3vKSaZZhc1bsn8NA4yzp1QgjQBXaFAHQaBD476SnwU");

#[program]
pub mod anchor_dapp {
    use super::*;

  pub fn close(_ctx: Context<CloseAnchorDapp>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.anchor_dapp.count = ctx.accounts.anchor_dapp.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.anchor_dapp.count = ctx.accounts.anchor_dapp.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeAnchorDapp>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.anchor_dapp.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeAnchorDapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + AnchorDapp::INIT_SPACE,
  payer = payer
  )]
  pub anchor_dapp: Account<'info, AnchorDapp>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseAnchorDapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub anchor_dapp: Account<'info, AnchorDapp>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub anchor_dapp: Account<'info, AnchorDapp>,
}

#[account]
#[derive(InitSpace)]
pub struct AnchorDapp {
  count: u8,
}
