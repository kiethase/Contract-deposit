import {
  connect,
  Contract,
  keyStores,
  utils,
  WalletConnection,
} from "near-api-js";
import { getConfig, getConfigToken } from "./config";
import { baseDecode } from "borsh";
import {BN} from 'bn.js'
// import Big Number for javascript
// import createTransaction and functionCall for transaction method calls
import { functionCall, createTransaction } from "near-api-js/lib/transaction";

const nearConfig = getConfig(process.env.NODE_ENV || "development");
const nearTokenConfig = getConfigToken(process.env.NODE_ENV || "development");


// const path = require("path");
// const homedir = require("os").homedir();
// const CREDENTIALS_DIR = ".near-credentials";
// Initialize contract & set global variables
export async function initContract() {
  // Initialize connection to the NEAR testnet
  const keyPair = utils.KeyPair.fromString(process.env.REACT_APP_PRIVATE_KEY);
  console.log(process.env.REACT_APP_PRIVATE_KEY);
  const keyStore = new keyStores.InMemoryKeyStore();
  keyStore.setKey("testnet", "kietne.testnet", keyPair);
  // Initialize connection to the NEAR testnet
  // const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))
  const near = await connect(Object.assign({ deps: { keyStore } }, nearConfig));
  // const near = await connect(nearConfig);
 
  window.near = near;
  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new WalletConnection(near);

  // Getting the Account ID. If still unauthorized, it's just empty string
  window.accountId = await window.walletConnection.getAccountId();

  //  const account = await near.account(window.accountId);

  // console.log(await account.getAccessKeys());
  // Initializing our contract APIs by contract name and configuration
  window.contract = new Contract(
    window.walletConnection.account(),
    nearConfig.contractName,
    {
      // View methods are read only. They don't modify the state, but usually return some value.
      viewMethods: [
        "get_deposits",
        "get_whitelisted_tokens",
        "storage_balance_of",
      ],
      // Change methods can modify the state. But you don't receive the returned value when called.
      changeMethods: [
        "new",
        "create_new_pool",
        "add_liquidity",
        "storage_deposit",
      ],
    }
  );

  //For contract token (deposit)
  window.tokenContract = new Contract(
    window.walletConnection.account(),
    nearTokenConfig.contractName,
    {
      viewMethods: ["ft_total_supply", "ft_balance_of"],
      changeMethods: ["ft_transfer", "ft_transfer_call", "storage_deposit"],
    }
  );
}

// export gas and amount for transaction
export const getGas = (gas) => Buffer.from(new BN("100000000000000"));

export const getAmount = (amount) =>
  amount ? Buffer.from(new BN("100000000000000")) : Buffer.from(new BN("0"));

// Thực  hiện  multipleTransaction  cho  token
// Thực hiện tạo ra block cho transaction cho
// Thực hiện hash block để  đưa lên web3 blockchain

