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
  const { nearBalance } = props;
  const [balanceNearChange, setBalanceNearChange] = React.useState();

  const handleChangeBalanceSubmit = (event) => {
    setBalanceNearChange(event.target.value);
  };

  const handleClose = () => {
    props.handleClose();
  };

  const validationSchema = yup
    .object({
      balanceNearChange: yup
        .number()
        .min(0, "Số lượng đặt phải lớn hơn 0")
        .max(nearBalance, "Amount have to lesser than balance near in wallet")
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
    console.log(data.balanceNearChange);
   
    handleClose();
    //  window.location.reload();
   
  };
  return (
    <>
      <form onSubmit={handleSubmit(submitForm)}>
        <DialogTitle>Wrap NEAR</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {/* Balance in wallet: {item.balanceWallet * 10 ** -item.decimals} */}
            Near Balance: {nearBalance}
          </DialogContentText>
          <TextField
            autoFocus
            {...register("balanceNearChange")}
            error={errors.balanceNearChange != null}
            helperText={errors.balanceNearChange?.message}
            label="Amount"
            margin="dense"
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            onChange={handleChangeBalanceSubmit}
          />
          <DialogContentText>
            {/* Balance in wallet: {item.balanceWallet * 10 ** -item.decimals} */}
            wNear Balance:
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
            disabled
            readOnly
            value={balanceNearChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </form>
    </>
  );
};

export default WrapTokenNearComponent;
