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

const DepositComponent = (props) => {
  const { item } = props;
  console.log(item);
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
    console.log(data.amount);
  };

  const depositToken = async () => {
    
  }



  return (
    <>
     <form onSubmit={handleSubmit(submitForm)}>
      <DialogTitle>DEPOSIT TOKEN "{item.name}"</DialogTitle>
      <DialogContent>
        <DialogContentText>Balance: {item.balanceWallet * 10 ** -8}</DialogContentText>
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
        <Button  type="submit">Deposit</Button>
      </DialogActions>
      </form>
    </>
  );
};

export default DepositComponent;
