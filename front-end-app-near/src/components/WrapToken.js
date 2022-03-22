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

const WrapTokenNearComponent = (props) => {
  const { item } = props;

  const handleClose = () => {
    props.handleClose();
  };

  const validationSchema = yup
    .object({
      amount: yup
        .number()
        .min(0, "Số lượng đặt phải lớn hơn 0")
        // .max(
        //   item.balanceWallet * 10 ** -item.decimals,
        //   "Amount have to lesser than balance in wallet"
        // )
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
    // await depositToken(data.amount, item.id);
    handleClose();
    //  window.location.reload();
    // dispatch({ type: "LOADING", newLoading: !loading });
  };
  return (
    <>
      <form onSubmit={handleSubmit(submitForm)}>
        <DialogTitle>Wrap NEAR</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {/* Balance in wallet: {item.balanceWallet * 10 ** -item.decimals} */}
            Balance
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

export default WrapTokenNearComponent;
