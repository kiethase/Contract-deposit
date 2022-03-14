use near_contract_standards::fungible_token::receiver::FungibleTokenReceiver;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{serde_json, PromiseOrValue};


use crate::*;

#[near_bindgen]
impl FungibleTokenReceiver for Contract{
    #[allow(unreachable_code)]
    fn ft_on_transfer(
        &mut self,
        sender_id: ValidAccountId,
        amount: U128,
        msg: String,
    ) -> PromiseOrValue<U128> {
        let token_in = env::predecessor_account_id();
        assert!(msg.is_empty(),"Msg much empty on deposit action!!");
        self.internal_save_transfer_information(&sender_id.to_string(), &token_in, amount.into());
        PromiseOrValue::Value(U128(0))
    }
}


impl Contract {
    pub fn internal_save_transfer_information(
        &mut self,
        account_id: &AccountId,
        token_id: &AccountId, 
        amount: Balance,
        
    ){
        //   Thực hiện lấy account thông qua method unwrap account id  
        let mut account = self.internal_unwrap_or_default_account(account_id);
        // THực hiện lấy balance trong account thông qua key token_id và unwrap ra 
        let account_amount = account.tokens.get(token_id).unwrap_or_default();
        //Kiểm tra số lượng được truyền vào có lớn hơn 0 hay không và phải lón hơn 0
        assert!(amount > 0 , "Amount must be greater than 0!");
        //Thực hiện xử lí dữ liệu nếu account_amount = 0 thì ta sẽ đưa vào amount
        //nếu account_amount > 0 thì ta lấy account_amount + amount được truyền vào
        if account_amount ==  0 {
            account.tokens.insert(token_id, &amount);
        } else {
            account.tokens.insert(token_id, &(amount + account_amount));
        }
        // Sau khi thực hiện thay đổi và xử lí các dữ liệu từ transfer ta sẽ thực hịện ghi chú
        // dữ liệu vào account contract từ đó có thể ghi chú lại số liệu
        self.internal_save_account(account_id, account);
    }
}
