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
  const { item } = props;
  // const [{ loading }, dispatch] = useStateValue();

  const config = getConfig("testnet");
  const accountInfor = JSON.parse(localStorage.getItem("undefined_wallet_auth_key"));


  const decimals = item.decimals;

  const handleClose = () => {
    props.handleClose();
  };

  const validationSchema = yup
    .object({
      amount: yup
        .number()
        .min(0, "Số lượng đặt phải lớn hơn 0")
        .max(item.balanceWallet * 10 ** -item.decimals, "Amount have to lesser than balance in wallet")
        .typeError("Invalid amount")
        .required("Amount can't be blank!"),
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
    await depositToken(data.amount, item.id);
     handleClose();
    //  window.location.reload();
  
    
   
  };

  



  const depositToken = async (amount, id) => {

    let transactions = [];

    let storageBalanceOfGet = await window.walletConnection
    .account()
    .viewFunction(config.contractName, "storage_balance_of", {
      account_id: accountInfor.accountId,
    });


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
          amount: "0.000000000000000000000001",
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
              // registration_only: true,
            },
            amount: "0.0125",
            gas: "100000000000000",
          },
        ],
      });
    }

    if (storageBalanceOfGet === null) {
      transactions.unshift({
        receiverId: config.contractName,
        functionCalls: [
          {
            methodName: "storage_deposit",
            args: {
              // registration_only: true,
            },
            amount: "0.1",
            gas: "100000000000000",
          },
        ],
      });
    } 
    else if(storageBalanceOfGet !== null){
      if (parseInt(storageBalanceOfGet.total) < 1000000000000000000000) {
        transactions.unshift({
          receiverId: config.contractName,
          functionCalls: [
            {
              methodName: "storage_deposit",
              args: {
                // registration_only: true,
              },
              amount: "0.1",
              gas: "100000000000000",
            },
          ],
        });
      }
    }
    return executeMultipleTransactions(transactions);
  };

  

  return (
    <>
      <form onSubmit={handleSubmit(submitForm)}>
        <DialogTitle>DEPOSIT TOKEN "{item.name}"</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Balance in wallet: {item.balanceWallet * 10 ** -item.decimals}
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
