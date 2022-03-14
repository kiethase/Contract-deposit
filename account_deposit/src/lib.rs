use std::convert::TryInto;
use std::fmt;
use std::collections::HashMap;


use near_contract_standards::storage_management::{
    StorageBalance, StorageBalanceBounds, StorageManagement,
};


use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap, UnorderedSet, Vector};
use near_sdk::json_types::{ValidAccountId, U128};
use near_sdk::{
    assert_one_yocto, env, log, near_bindgen, AccountId, Balance, PanicOnDefault, Promise,
    PromiseResult, StorageUsage, BorshStorageKey
};


use crate::account_deposit::{Account};
use crate::errors::*;


mod account_deposit;
mod errors;
mod storage_impl;
mod token_receivers;


near_sdk::setup_alloc!();


#[derive(BorshStorageKey, BorshSerialize)]
pub(crate) enum StorageKey {
    Accounts,
    Whitelist,
    AccountTokens {account_id: AccountId},
}


#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Eq, PartialEq, Clone)]
#[serde(crate = "near_sdk::serde")]
#[cfg_attr(not(target_arch = "wasm32"), derive(Debug))]
pub enum RunningState {
    Running, Paused
}

impl fmt::Display for RunningState {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            RunningState::Running => write!(f, "Running"),
            RunningState::Paused => write!(f, "Paused"),
        }
    }
}

#[near_bindgen]
#[derive(BorshSerialize,BorshDeserialize,PanicOnDefault)]
pub struct Contract{
    // Account of the owner.
    owner_id: AccountId,
    // Account register, keeping track all the amounts deposited, storage and more.
    accounts: LookupMap<AccountId,Account>,
    // Whitelisted was set by owner
    whitelistied_tokens: UnorderedSet<AccountId>,
}

#[near_bindgen]
impl Contract{
    #[init]
    pub fn new(owner_id:ValidAccountId)->Self{
        Self {
            owner_id:owner_id.as_ref().clone(),
            accounts:LookupMap::new(StorageKey::Accounts),
            whitelistied_tokens: UnorderedSet::new(StorageKey::Whitelist),
        }
    }
    
    pub fn get_deposits(&self, account_id: ValidAccountId) -> HashMap<AccountId, U128> {
        let wrapped_account = self.internal_get_account(account_id.as_ref());
        if let Some(account) = wrapped_account {
            account.get_tokens()
                .iter()
                .map(|token| (token.clone(), U128(account.get_balance(token).unwrap())))
                .collect()
        } else {
            HashMap::new()
        }
    }
}

impl Contract{
    fn internal_check_storage(&self, prev_storage: StorageUsage) {
        let storage_cost = env::storage_usage()
            .checked_sub(prev_storage)
            .unwrap_or_default() as Balance
            * env::storage_byte_cost();

        let refund = env::attached_deposit()
            .checked_sub(storage_cost)
            .expect(
                format!(
                    "ERR_STORAGE_DEPOSIT need {}, attatched {}", 
                    storage_cost, env::attached_deposit()
                ).as_str()
            );
        if refund > 0 {
            Promise::new(env::predecessor_account_id()).transfer(refund);
        }
    }

  
}

















#[cfg(test)]
mod tests {
    use near_sdk::{near_bindgen, PanicOnDefault};

    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert_eq!(result, 4);
    }
}
