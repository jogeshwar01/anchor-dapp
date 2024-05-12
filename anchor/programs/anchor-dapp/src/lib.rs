#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("7brWaJ6xaB8qE8u7N5S1undQZjZMT7FBLYBfDfDxafF1");

#[program]
pub mod anchor_dapp {
    use super::*;

    pub fn create_entry(
      ctx: Context<CreateEntry>,
      title: String,
      message: String
    ) -> Result<()> {
      let journal_entry = &mut ctx.accounts.journal_entry;
      journal_entry.owner = ctx.accounts.owner.key();
      journal_entry.title = title;
      journal_entry.message = message;

      Ok(())
    }

    pub fn update_entry(
      ctx: Context<UpdateEntry>,
      _title: String,  // will be used to find the pda - used _ to tell rust we know its not used anywhere
      new_message: String
    ) -> Result<()> {
      let journal_entry = &mut ctx.accounts.journal_entry;
      journal_entry.message = new_message;

      Ok(())
    }

    pub fn delete_entry(
      _ctx: Context<DeleteEntry>,
      _title: String,
    ) -> Result<()> {
      Ok(())
    }

}

#[account]
#[derive(InitSpace)]
pub struct JournalEntryState {
  pub owner: Pubkey,
  #[max_len(20)]      // need this for variable length types if we need to use InitSpace
  pub title: String,
  #[max_len(200)]
  pub message: String,
  pub entry_id: u64,
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct CreateEntry<'info> {
  #[account(
    init,
    seeds = [title.as_bytes(), owner.key().as_ref()],
    bump,
    payer = owner,
    space = 8 + JournalEntryState::INIT_SPACE,
  )]
  pub journal_entry: Account<'info, JournalEntryState>,
  #[account(mut)]
  pub owner: Signer<'info>,
  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct UpdateEntry<'info> {
  #[account(
    mut,
    seeds = [title.as_bytes(), owner.key().as_ref()],
    bump,
    realloc = 8 + JournalEntryState::INIT_SPACE,   // as our string values change, space will have to be reallocated - either increase or decrease
    realloc::payer = owner,  // needs to pay rent or get back excess rent when string changes
    realloc::zero = true
  )]
  pub journal_entry: Account<'info, JournalEntryState>,
  #[account(mut)]
  pub owner: Signer<'info>,
  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct DeleteEntry<'info> {
  #[account(
    mut,
    seeds = [title.as_bytes(), owner.key().as_ref()],
    bump,
    close = owner   // you need to be the associated pub key to close account
  )]
  pub journal_entry: Account<'info, JournalEntryState>,
  #[account(mut)]
  pub owner: Signer<'info>,
  pub system_program: Program<'info, System>,
}
