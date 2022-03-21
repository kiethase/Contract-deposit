import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Deposit from "../components/Deposit";
import Withdraw from "../components/Withdraw";
import { getConfig } from "../services/config";
import { useStateValue } from "../common/StateProvider";


const AccountPage = () => {
  const [result, setResult] = React.useState([]);
  // const [{ loading }, dispatch] = useStateValue();

  const contract = window.contract;
  const accountId = window.accountId;
  const tokenContract = window.tokenContract;

  const config = getConfig("testnet");
  // Dialog control
  const [itemDeposit, setItemDeposit] = React.useState();
  const [itemWithdraw, setItemWithdraw] = React.useState();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openDialog2, setOpenDialog2] = React.useState(false);

  const handleOpen = (item) => {
    setItemDeposit(item);
    setOpenDialog(true);
  };
  const handleClose = () => {
    setOpenDialog(false);
  };
  const handleOpen2 = (item) => {
    setItemWithdraw(item);
    setOpenDialog2(true);
  };
  const handleClose2 = () => {
    setOpenDialog2(false);
  };

  //Register
  const registerAccountToToken = async () => {
    await tokenContract.storage_deposit(
      {
        account_id:  config.contractName,
      },
      "300000000000000",
      "12500000000000000000000",
     
    );
  
  };

  const handleRegisterExToToken = async (id) => {
    let transactions = [];

    transactions.unshift({
      receiverId: id,
      functionCalls: [
        {
          methodName: "storage_deposit",
          args: {
            account_id: config.contractName,
          },
          amount: "1",
          gas: "100000000000000",
        },
      ],
    });
    await registerAccountToToken();
  };

  // "ft_balance_of"
  const getBalanceOf = async () => {
    setResult([]);
    let obj = {};
    // Đây chúng ta lấy dữ liệu deposit gồm tokenID và amount
    let deposit_values = await contract.get_deposits({ account_id: accountId });
    console.log(deposit_values);
    const tokens = await fetch(
      `${config.helperUrl}/account/${accountId}/likelyTokens`
    )
      .then((response) => response.json())
      .then((tokens) => tokens);

    for (let i of tokens) {
      let balanceOfTokenInWallet = await window.walletConnection
        .account()
        .viewFunction(i, "ft_balance_of", { account_id: accountId })
        .catch((err) => {
          return {
            isFailed: true,
          };
        });
      if (balanceOfTokenInWallet.isFailed) {
        continue;
      }
      let metadataToken = await window.walletConnection
        .account()
        .viewFunction(i, "ft_metadata");

      let storageBalanceOfGet = await window.walletConnection
        .account()
        .viewFunction(i, "storage_balance_of", {
          account_id: config.contractName,
        });

      obj = {
        id: i,
        name: metadataToken.name,
        balanceWallet: balanceOfTokenInWallet,
        decimals: metadataToken.decimals,
      };
      if (storageBalanceOfGet !== null) {
        obj.checkRegister = true;
      }
      for (let i2 in deposit_values) {
        if (i === i2) {
          obj.balanceInContract = deposit_values[i];
        }
      }

      setResult((data) => [...data, obj]);
    }
  };

  React.useEffect(async() => {
    await getBalanceOf();
  }, []);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#287FD1",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Stt</StyledTableCell>
            <StyledTableCell>Token Name</StyledTableCell>
            <StyledTableCell>Token ID</StyledTableCell>
            <StyledTableCell align="center">Amount in wallet</StyledTableCell>
            <StyledTableCell align="center">Amount in exchange</StyledTableCell>
            <StyledTableCell align="center">Decimal</StyledTableCell>
            <StyledTableCell align="center">--</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {result.map((item, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" scope="row">
                {index + 1}
              </StyledTableCell>
              <StyledTableCell>{item.name}</StyledTableCell>
              <StyledTableCell>{item.id}</StyledTableCell>
              <StyledTableCell align="center">
                {item.balanceWallet  * (10 ** -item.decimals) }
              </StyledTableCell>

              <StyledTableCell align="center">
                {item.balanceInContract
                  ? item.balanceInContract * (10 ** -item.decimals)
                  : 0}
              </StyledTableCell>
              <StyledTableCell align="center">
                {item.decimals}
              </StyledTableCell>
              <StyledTableCell align="center">
                <Button
                    variant="contained"
                    sx={{ bgcolor: "#2E6EE6" }}
                    onClick={() => handleOpen(item)}
                  >
                    Deposit
                  </Button>
                &nbsp;
                <Button
                    variant="contained"
                    sx={{ bgcolor: "#2E6EE6" }}
                    onClick={() => handleOpen2(item)}
                  >
                    Withdraw
                  </Button>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={openDialog} onClose={handleClose}>
      <Deposit handleClose={handleClose} item={itemDeposit}/>
      </Dialog>
      <Dialog open={openDialog2} onClose={handleClose2}>
      <Withdraw handleClose2={handleClose2} item={itemWithdraw}/>
      </Dialog>
    </TableContainer>
  );
};

export default AccountPage;
