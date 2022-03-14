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



const DepositComponent = (props) => {
  const { item } = props;
  const config = getConfig("testnet");
  const tokenContract = window.tokenContract;

  // const configContract = "kei13.testnet";
  // const ONE_YOCTO_NEAR = "0.000000000000000000000001";
  const decimals = item.decimals;

  const handleClose = () => {
    props.handleClose();
  };

  const validationSchema = yup
    .object({
      amount: yup
        .number()
        .min(1, "Số lượng đặt phải lớn hơn 0")
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

  const submitForm = (data) => {
    // console.log(data.amount);
    // let transactions = [];
    depositToken(data.amount, item.name, item.balanceInContract);
    // if (!('balanceInContract' in item)) {
    //   transactions.unshift({
    //     receiverId: item.id,
    //     functionCalls: [
    //       {
    //         methodName: "storage_deposit",
    //         args: {
    //           account_id: config.contractName,
    //         },
    //         amount: "0.0125",
    //         gas: "100000000000000",
    //       },
    //     ],
    //   });
    //   // registerAccountToToken();
    // }
  };

  // Thực hiện hàm ft_transfer_call
  const ftTransferCall = async (amountDeposit) => {
    await tokenContract.ft_transfer_call(
      {
        receiver_id: config.contractName,
        amount: `${amountDeposit}00000000`,
        msg: "",
      },
      "300000000000000",
      "1"
    );
  };

  const registerAccountToToken = async () => {
      await tokenContract.storage_deposit(
        {
          account_id: config.contractName,
        },
        '0.0125',
        '300000000000000'
      )
  }

  const depositToken = async (amount, id, checkingRegisterBalance) => {
    let transactions = [];
    console.log("Data: ", amount, id, checkingRegisterBalance);
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

    console.log(checkingRegisterBalance);
    if (!('balanceInContract' in item)) {
     
      transactions.unshift({
        receiverId: id,
        functionCalls: [
          {
            methodName: "storage_deposit",
            args: {
              account_id: config.contractName,
            },
            amount: "0.0125",
            gas: "100000000000000",
          },
        ],
      });
      console.log(transactions);
      registerAccountToToken();
    }
    ftTransferCall(amount);

  };

  return (
    <>
      <form onSubmit={handleSubmit(submitForm)}>
        <DialogTitle>DEPOSIT TOKEN "{item.name}"</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Balance: {item.balanceWallet * 10 ** -8}
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