import {
  connect,
  Contract,
  keyStores,
  utils,
  WalletConnection,
  ConnectedWalletAccount,
} from "near-api-js";
import { getConfig } from "./config";
import { baseDecode } from "borsh";
import { BN } from "bn.js";
// import Big Number for javascript
// import createTransaction and functionCall for transaction method calls
import { functionCall, createTransaction } from "near-api-js/lib/transaction";
import { PublicKey } from "near-api-js/lib/utils";

const nearConfig = getConfig(process.env.NODE_ENV || "development");

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
        "withdraw",
      ],
    }
  );


}

export const getGas = (gas) => (gas ? new BN(gas) : new BN("100000000000000"));
export const getAmount = (amount) =>
  amount ? new BN(utils.format.parseNearAmount(amount)) : new BN("0");

const createTransactionConfig = async (receiverId, actions, i) => {
  //????Y L?? C??CH L???Y KEY D???A TR??N INMEMORY V?? S??? D???NG SO S??NH ACCESSKEY ????? TH???C HI???N K?? NH???N
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

  //????Y L?? C??CH TH???C HI???N L???Y  NH???NG ACCESS KEY C?? S???N TRONG ACCOUNT T??? ???? NH???NG
  //ACCESS KEY N??Y S??? L?? ?????I DI???N K?? NH???N C???A ACCOUNT/TOKEN CHO C??C TRANSACTION
  //C??C ACCESS KEY N??Y C?? TH??? GENERATE RA BAO NHI??U TU??? ?? V?? C??NG C?? TH??? XEM L???I
  //ACCESS KEY N??O D??NG CHO GIAO D???CH N??O TH??NG QUA METHOD FINDACCESSKEY
  // const accountInforGet = await window.near.account(window.accountId);
  const accountInfor = JSON.parse(
    localStorage.getItem("undefined_wallet_auth_key")
  );

  const accessKey = accountInfor.allKeys[0];
  // const accessKeys = await accountInforGet.getAccessKeys();
  // const accessKey = accessKeys[0].public_key;
  const block = await window.near.connection.provider.block({
    finality: "final",
  });
  const blockHash = baseDecode(block.header.hash);
  const publicKey = PublicKey.from(accessKey);
  const nonce = i + 1;
  return createTransaction(
    window.accountId,
    publicKey,
    receiverId,
    nonce,
    actions,
    blockHash
  );
};

// Th???c hi???n theo ph????ng ph??p requestSignTransactions
export const executeMultipleTransactions = async (transactions) => {
  // console.log(transactions);
  const nearTransactions = await Promise.all(
    transactions.map(async (t, i) => {
      return createTransactionConfig(
        t.receiverId,
        t.functionCalls.map((fc) =>
          functionCall(
            fc.methodName,
            fc.args,
            getGas(fc.gas),
            getAmount(fc.amount)
          )
        ),
        i
      );
    })
  );

  return window.walletConnection.requestSignTransactions({
    transactions: nearTransactions,
  });
};


 export const withdrawCall = async (amountWithdraw,item) => {
  
    await window.contract.withdraw(
      {
        token_id: item.id,
        amount: (amountWithdraw * 10 ** item.decimals).toString(),
        
      },
      getGas("300000000000000"),
      getAmount("0.000000000000000000000001"),
    );
  };
