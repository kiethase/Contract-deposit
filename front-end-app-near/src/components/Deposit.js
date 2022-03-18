import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getConfig } from "../services/config";
import { executeMultipleTransactions } from "../services/near";
import { baseDecode } from "borsh";
import { functionCall, createTransaction } from "near-api-js/lib/transaction";
import { useStateValue } from "../common/StateProvider";


const DepositComponent = (props) => {
  const { item,setStatus } = props;
  // const [{ loading }, dispatch] = useStateValue();

  const config = getConfig("testnet");
  const accountInfor = JSON.parse(localStorage.getItem("undefined_wallet_auth_key"));

  const key = accountInfor.allKeys[0];
    console.log(accountInfor.allKeys[0]);
    // const ONE_YOCTO_NEAR = "0.000000000000000000000001";
  const decimals = item.decimals;

  const handleClose = () => {
    props.handleClose();
  };

  const validationSchema = yup
    .object({
      amount: yup
        .number()
        .min(0, "Số lượng đặt phải lớn hơn 0")
        .typeError("Số lượng phải lớn hơn 0")
        .required("Số lượng đặt mua"),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const submitForm = async (data) => {
    // console.log(data.amount);
    await depositToken(data.amount, item.id);
     handleClose();
     window.location.reload();
    // dispatch({ type: "LOADING", newLoading: !loading });
    
   
  };

  

  // Thực hiện hàm ft_transfer_call
  // const ftTransferCall = async (amountDeposit) => {
  //   console.log(amountDeposit * 10 ** decimals);
  //   await tokenContract.ft_transfer_call(
  //     {
  //       receiver_id: config.contractName,
  //       amount: (amountDeposit * 10 ** decimals).toString(),
  //       msg: "",
  //     },
  //     "300000000000000",
  //     "1"
  //   );
  // };

  /// REGISTER
  // const registerAccountToToken = async (id) => {
  //   await tokenContract.storage_deposit(
  //     {
  //       account_id:  config.contractName,
  //     },
  //     "300000000000000",
  //     "12500000000000000000000",

  //   );

  // };

  const depositToken = async (amount, id) => {
    let transactions = [];

    transactions.unshift({
      receiverId: id,
      functionCalls: [
        {
          methodName: "ft_transfer_call",
          args: {
            receiver_id: config.contractName,
            amount: (10 ** decimals * amount).toString(),
            msg: "",
          },
          amount: "1",
          gas: "100000000000000",
        },
      ],
    });

    if (!("checkRegister" in item)) {
      transactions.unshift({
        receiverId: id,
        functionCalls: [
          {
            methodName: "storage_deposit",
            args: {
              account_id: config.contractName,
              registration_only: true,
            },
            amount: "12500000000000000000000",
            gas: "100000000000000",
          },
        ],
      });
    }
    return executeMultipleTransactions(transactions);
  };

  const executeMultipleTransactions = async (transactions) => {
    const nearTransactions = await Promise.all(
      transactions.map(async (t, i) => {
        let block = await window.near.connection.provider.block({
          finality: "final",
        });
        let blockHash = baseDecode(block.header.hash);
        return createTransaction(
          window.accountId,
          process.env.REACT_APP_PRIVATE_KEY,
          t.receiverId,
          i + 1,
          t.functionCalls.map((fc) => {
            return functionCall(fc.methodName, fc.args, fc.gas, fc.amount);
          }),
          blockHash
        );
      })
    );
    let actions = [];
    nearTransactions.map((item) => {
      actions.push(item.actions[0])
      console.log(item.actions[0]);
    });
    const account = await window.near.account(window.accountId);
    return account.signAndSendTransaction({
      receiverId: nearTransactions[0].receiverId,
      actions,
    });
    /*global event, fdescribe*/
    /*eslint no-restricted-globals: ["error", "event", "fdescribe"]*/
    
  };

  return (
    <>
      <form onSubmit={handleSubmit(submitForm)}>
        <DialogTitle>DEPOSIT TOKEN "{item.name}"</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Balance: {item.balanceWallet * 10 ** -item.decimals}
          </DialogContentText>
          <TextField
            autoFocus
            {...register("amount")}
            error={errors.amount != null}
            helperText={errors.amount?.message}
            label="Amount"
            margin="dense"
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            type="number"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Deposit</Button>
        </DialogActions>
      </form>
    </>
  );
};

export default DepositComponent;
