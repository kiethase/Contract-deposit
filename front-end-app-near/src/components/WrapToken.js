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
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Fab from "@mui/material/Fab";
import SwapVerticalCircleRoundedIcon from "@mui/icons-material/SwapVerticalCircleRounded";
import { executeMultipleTransactions } from "../services/near";
import { utils } from 'near-api-js';


export const { WRAP_NEAR_CONTRACT_ID } = getConfig("testnet");
const WrapTokenNearComponent = (props) => {
  const { nearBalance } = props;
  const [swapStatus, setSwapStatus] = React.useState(true);

  const [balanceNearChange, setBalanceNearChange] = React.useState();
  const accountInfor = JSON.parse(
    localStorage.getItem("undefined_wallet_auth_key")
  );
  const config = getConfig("testnet");

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
        .max(
          nearBalance.near,
          "Amount have to lesser than balance near in wallet"
        )
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
    if (swapStatus) {
      await nearDeposit(data.balanceNearChange.toString());
    } else {
      await nearWithdraw(data.balanceNearChange.toString());
    }

    handleClose();
    //  window.location.reload();
  };

  const nearDeposit = async (amountIn) => {
    let transactions = [];
    let storageBalanceOfGet = await window.walletConnection
      .account()
      .viewFunction(WRAP_NEAR_CONTRACT_ID, "storage_balance_of", {
        account_id: accountInfor.accountId,
      });

    // Thực hiện kiểm tra account đã đk zô contract chưa nếu chưa thì phải dk
    // Mới thực hiện đc chuyển wNear
    if (storageBalanceOfGet === null) {
      transactions.unshift({
        receiverId: WRAP_NEAR_CONTRACT_ID,
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
    // chúng ta thực hiện chuyển Near coin -> wNear token.
    transactions.unshift({
      receiverId: WRAP_NEAR_CONTRACT_ID,
      functionCalls: [
        {
          methodName: "near_deposit",
          args: {},
          amount: amountIn,
          gas: "50000000000000",
        },
      ],
    });
    return executeMultipleTransactions(transactions);
  };

  const nearWithdraw = async (amountOut) => {
    let transactions = [];
    let storageBalanceOfGet = await window.walletConnection
      .account()
      .viewFunction(WRAP_NEAR_CONTRACT_ID, "storage_balance_of", {
        account_id: accountInfor.accountId,
      });

    // Thực hiện kiểm tra account đã đk zô contract chưa nếu chưa thì phải dk
    // Mới thực hiện đc chuyển wNear
    if (storageBalanceOfGet === null) {
      transactions.unshift({
        receiverId: WRAP_NEAR_CONTRACT_ID,
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
    transactions.unshift({
      receiverId: WRAP_NEAR_CONTRACT_ID,
      functionCalls: [
        {
          methodName: "near_withdraw",
          args: {
              // Chú ý phải chuyển đổi amount wNear thành amount Near mới có thể thực hiện chuyển đổi
              // Và phải đảm bảo account đk vào contract và đưa phí 1 YOCTO NEAR
            amount:   utils.format.parseNearAmount(amountOut),
          },
          amount: "0.000000000000000000000001",
        },
      ],
    });
    return executeMultipleTransactions(transactions);
  };

  const renderFieldNearAndWNear = (status) => {
    if (status) {
      return (
        <DialogContentText>Near Balance: {nearBalance.near}</DialogContentText>
      );
    } else {
      return (
        <DialogContentText>
          wNear Balance: {nearBalance.wNear}
        </DialogContentText>
      );
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit(submitForm)}>
        <DialogTitle>Wrap NEAR</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            Near Balance: {nearBalance.near}
          </DialogContentText> */}
          {renderFieldNearAndWNear(swapStatus)}
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

          <Divider sx={{ marginBottom: "20px", marginTop: "20px" }}>
            <Fab
              color="primary"
              aria-label="swap"
              onClick={() => setSwapStatus(!swapStatus)}
            >
              <SwapVerticalCircleRoundedIcon fontSize="large" />
            </Fab>
          </Divider>

          {renderFieldNearAndWNear(!swapStatus)}
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
