import { connect, Contract, keyStores, WalletConnection } from "near-api-js";
import { getConfig, getConfigToken } from "./config";
// import Big Number for javascript
import { BN } from "bn.js";
// import createTransaction and functionCall for transaction method calls
import { functionCall, createTransaction } from "near-api-js/lib/transaction";

const nearConfig = getConfig(process.env.NODE_ENV || "development");
const nearTokenConfig = getConfigToken(process.env.NODE_ENV || "development");
// Initialize contract & set global variables
export async function initContract() {
  // Initialize connection to the NEAR testnet
  const near = await connect(
    Object.assign(
      { deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } },
      nearConfig
    )
  );

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new WalletConnection(near);

  // Getting the Account ID. If still unauthorized, it's just empty string
  window.accountId = await window.walletConnection.getAccountId();
  // Initializing our contract APIs by contract name and configuration
  window.contract = new Contract(
    window.walletConnection.account(),
    nearConfig.contractName,
    {
      // View methods are read only. They don't modify the state, but usually return some value.
      viewMethods: ["get_deposits","get_whitelisted_tokens","storage_balance_of"],
      // Change methods can modify the state. But you don't receive the returned value when called.
      changeMethods: ["new", "create_new_pool", "add_liquidity"],
    }
  );

  //For contract token (deposit)
  window.tokenContract = new Contract(
    window.walletConnection.account(),
    nearTokenConfig.contractName,
    {
      viewMethods: ["ft_total_supply", "ft_balance_of"],
      changeMethods: ["ft_transfer", "ft_transfer_call","storage_deposit"],
    }
  );
}

// export gas and amount for transaction
// export const getGas = (gas) => Buffer.from(new BN("100000000000000"));

// export const getAmount = (amount) =>
//   amount ? Buffer.from(new BN("100000000000000")) : Buffer.from(new BN("0"));

// // Thực  hiện  multipleTransaction  cho  token
// export const executeMultipleTransactions = async (transaction) => {
//   const nearTransactions = await Promise.all(
//     transaction.map((t, i) => {
//       return createTransaction({
//         receiverId: t.receiverId,
//         nonce: i + 1,
//         actions: t.functionCalls.map((fc) =>
//           functionCall(
//             fc.methodName,
//             fc.args,
//             getGas(fc.gas),
//             getAmount(fc.amount)
//           )
//         ),
//       });
//     })
//   );
//   return window.walletConnection.requestSignTransaction(nearTransactions);
// };
