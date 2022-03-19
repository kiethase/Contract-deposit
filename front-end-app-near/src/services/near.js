import {
  connect,
  Contract,
  keyStores,
  utils,
  WalletConnection,
  ConnectedWalletAccount
} from "near-api-js";
import { getConfig, getConfigToken } from "./config";
import { baseDecode } from "borsh";
import { BN } from "bn.js";
// import Big Number for javascript
// import createTransaction and functionCall for transaction method calls
import { functionCall, createTransaction } from "near-api-js/lib/transaction";
import { PublicKey } from "near-api-js/lib/utils";

const nearConfig = getConfig(process.env.NODE_ENV || "development");
const nearTokenConfig = getConfigToken(process.env.NODE_ENV || "development");

// const path = require("path");
// const homedir = require("os").homedir();
// const CREDENTIALS_DIR = ".near-credentials";
// Initialize contract & set global variables
export async function initContract() {
  // Initialize connection to the NEAR testnet

  // const keyPair = utils.KeyPair.fromString(process.env.REACT_APP_PRIVATE_KEY);
  // console.log(process.env.REACT_APP_PRIVATE_KEY);
  // const keyStore = new keyStores.InMemoryKeyStore();
  // keyStore.setKey("testnet", "kietne.testnet", keyPair);
  // Initialize connection to the NEAR testnet
  const near = await connect(
    Object.assign(
      { deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } },
      nearConfig
    )
  );
  // const near = await connect(Object.assign({ deps: { keyStore } }, nearConfig));
  // const near = await connect(nearConfig);

  window.near = near;
  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new WalletConnection(near);
  window.connectedWalletAccount = new ConnectedWalletAccount(near);
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
// export const getGas = (gas) => Buffer.from(new BN("100000000000000"));

// export const getAmount = (amount) =>
//   amount ? Buffer.from(new BN("100000000000000")) : Buffer.from(new BN("0"));

// Thực  hiện  multipleTransaction  cho  token
// Thực hiện tạo ra block cho transaction cho
// Thực hiện hash block để  đưa lên web3 blockchain

// thực hiện theo
// export const executeMultipleTransactions = async (
//   transactions,
// ) => {
//   const { wallet, wallet_type } = getCurrentWallet();

//   const currentTransactions = await Promise.all(
//           transactions.map((t, i) => {
//             return wallet.createTransaction({
//               receiverId: t.receiverId,
//               nonceOffset: i + 1,
//               actions: t.functionCalls.map((fc) =>
//                 functionCall(
//                   fc.methodName,
//                   fc.args,
//                   getGas(fc.gas),
//                   getAmount(fc.amount)
//                 )
//               ),
//             });
//           })
//         );

//   return wallet.requestSignTransactions(currentTransactions);
// };

const createTransactionConfig = async (
  receiverId,
  actions,
  i
) => {

  //ĐÂY LÀ CÁCH LẤY KEY DỰA TRÊN INMEMORY VÀ SỬ DỤNG SO SÁNH ACCESSKEY ĐỂ THỰC HIỆN KÍ NHẬN
  // const localKey = window.near.connection.signer.getPublicKey(
  //   window.accountId,
  //   window.near.connection.networkId
  // );
  // console.log(localKey);
  //   console.log(receiverId, actions, localKey);
  // let accessKey = await window.near.accessKeyForTransaction(receiverId, actions, localKey);
  // if (!accessKey) {
  //   throw new Error(
  //     `Cannot find matching key for transaction sent to ${receiverId}`
  //   );
  // }

  //ĐÂY LÀ CÁCH THỰC HIỆN LẤY  NHỮNG ACCESS KEY CÓ SẴN TRONG ACCOUNT TỪ ĐÓ NHỮNG 
  //ACCESS KEY NÀY SẼ LÀ ĐẠI DIỆN KÍ NHẬN CỦA ACCOUNT/TOKEN CHO CÁC TRANSACTION
  //CÁC ACCESS KEY NÀY CÓ THỂ GENERATE RA BAO NHIÊU TUỲ Ý VÀ CŨNG CÓ THỂ XEM LẠI
  //ACCESS KEY NÀO DÙNG CHO GIAO DỊCH NÀO THÔNG QUA METHOD FINDACCESSKEY 
  // const accountInforGet = await window.near.account(window.accountId);
  const accountInfor = JSON.parse(localStorage.getItem("undefined_wallet_auth_key"));

  const accessKey = accountInfor.allKeys[0];
  // const accessKeys = await accountInforGet.getAccessKeys();
  // const accessKey = accessKeys[0].public_key;
  const block = await window.near.connection.provider.block({ finality: "final" });
  const blockHash = baseDecode(block.header.hash);
  const publicKey = PublicKey.from(accessKey);
  const nonce =  i + 1;
  return createTransaction(
    window.accountId,
    publicKey,
    receiverId,
    nonce,
    actions,
    blockHash
  );
};

// Thực hiện theo phương pháp requestSignTransactions
export const executeMultipleTransactions = async (transactions) => {
  const nearTransactions = await Promise.all(
    transactions.map(async (t, i) => {
      return createTransactionConfig(
        t.receiverId,
        t.functionCalls.map((fc) =>
          functionCall(fc.methodName, fc.args, fc.gas, fc.amount)
        ),
        i
      );
    })
  );

  return window.walletConnection.requestSignTransactions({
     transactions: nearTransactions,
   
  });
};
