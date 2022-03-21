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
import { executeMultipleTransactions,withdrawCall } from "../services/near";
import { getConfig } from "../services/config";


const WithdrawComponent = (props) => {
  const { item } = props;
  // const [{ loading }, dispatch] = useStateValue();
  const decimals = item.decimals;
  const config = getConfig("testnet");
  const accountInfor = JSON.parse(
    localStorage.getItem("undefined_wallet_auth_key")
  );

  // const ONE_YOCTO_NEAR = "0.000000000000000000000001";

  const handleClose = () => {
    props.handleClose2();
  };

  const validationSchema = yup
    .object({
      amount: yup
        .number()
        .min(0, "Amount have to greater than zero")
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
    await withdrawCall(data.amount,item)
    handleClose();
  };

//   const withdraw = async (amount, id) => {
//     let transactions = [];
//     transactions.unshift({
//       receiverId: config.contractName,
//       functionCalls: [
//         {
//           methodName: "withdraw",
//           args: {
//             token_id: id,
//             amount: (10 ** decimals * amount).toString(),
//           },
//           amount: "0.000000000000000000000001",
//           gas: "100000000000000",
//         },
//       ],
//     });
//     return executeMultipleTransactions(transactions);
//   };

  return (
    <>
      <form onSubmit={handleSubmit(submitForm)}>
        <DialogTitle>WITHDRAW TOKEN "{item.name}"</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Balance in exchange: {item.balanceInContract * 10 ** -item.decimals}
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
          <Button type="submit">Withdraw</Button>
        </DialogActions>
      </form>
    </>
  );
};

export default WithdrawComponent;
