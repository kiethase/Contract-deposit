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
import WrapNear from "../components/WrapToken";
import Withdraw from "../components/Withdraw";
import { getConfig } from "../services/config";
import { useStateValue } from "../common/StateProvider";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import nearIcon from "../assets/9d5c43cc-e232-4267-aa8a-8c654a55db2d-1608222929-b90bbe4696613e2faeb17d48ac3aa7ba6a83674a.png";
import swapIcon from "../assets/Swap-Vector-Transparent.png";

import wNearIcon from "../assets/racoon.png";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { maxWidth } from "@mui/system";

const AccountPage = () => {
  const [result, setResult] = React.useState([]);

  const contract = window.contract;
  const accountId = window.accountId;

  const config = getConfig("testnet");
  // Dialog control
  const [itemDeposit, setItemDeposit] = React.useState();
  const [nearBalance, setNearBalance] = React.useState();
  const [itemWithdraw, setItemWithdraw] = React.useState();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openDialog2, setOpenDialog2] = React.useState(false);
  const [openSwapWrapNear, setOpenSwapWrapNear] = React.useState(false);

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

  const handleOpenWrap = () => {
    setOpenSwapWrapNear(true);
  };

  const handleCloseWrap = () => {
    setOpenSwapWrapNear(false);
  };

  // "ft_balance_of"
  const getBalanceOf = async () => {
    setResult([]);
    let obj = {};
    let objNear = {};
    // Đây chúng ta lấy dữ liệu deposit gồm tokenID và amount
    let deposit_values = await contract.get_deposits({ account_id: accountId });
    // Lấy nearBalance trong ví và wNear trong account gộp lại thành objNear
    let balanceAccount = await window.walletConnection
      .account()
      .getAccountBalance();
    let balanceWNear = await window.walletConnection
      .account()
      .viewFunction("wrap.testnet", "ft_balance_of", { account_id: accountId })
      .catch((err) => {
        return {
          isFailed: true,
        };
      });
      objNear = {
          near: (balanceAccount.available * 10 ** -24).toFixed(5),
          wNear: (balanceWNear * 10 ** -24).toFixed(5),
      }
    setNearBalance(objNear);

    // Lấy các token trong account và thực hiẹne ghi nhận lại chuỗi obj vs các
    // giá trị của token đó.
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

  React.useEffect(async () => {
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
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      spacing={2}
    >
      <Card>
        <CardHeader
          avatar={<Avatar alt="Remy Sharp" src={nearIcon} mr={5} />}
          titleTypographyProps={{ variant: "h6" }}
          action={
            <Chip
              onClick={handleOpenWrap}
              avatar={<Avatar alt="Natacha" src={nearIcon} />}
              color="primary"
              label={<img src={swapIcon} width="15" height="10" />}
              variant="outlined"
              sx={{ margin: 5 }}
              deleteIcon={
                <img
                  alt="Natacha"
                //   src={wNearIcon}
                  src="https://i.postimg.cc/DZfHgngm/w-NEAR-no-border.png"
                  width="27"
                  height="27"
                  style={{ borderRadius: "50%" }}
                />
              }
              onDelete={handleOpenWrap}
            />
          }
          title={nearBalance? nearBalance.near + " NEAR" : ""}
        />
      </Card>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Stt</StyledTableCell>
              <StyledTableCell>Token Name</StyledTableCell>
              <StyledTableCell>Token ID</StyledTableCell>
              <StyledTableCell align="center">Amount in wallet</StyledTableCell>
              <StyledTableCell align="center">
                Amount in exchange
              </StyledTableCell>
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
                <StyledTableCell>
                  {item.id}{" "}
                  {item.id === "wrap.testnet" ? (
                    <img
                      alt="Natacha"
                      src="https://i.postimg.cc/DZfHgngm/w-NEAR-no-border.png"
                      width="27"
                      height="27"
                      style={{ borderRadius: "50%" }}
                    />
                  ) : null}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {item.balanceWallet * 10 ** -item.decimals}
                </StyledTableCell>

                <StyledTableCell align="center">
                  {item.balanceInContract
                    ? item.balanceInContract * 10 ** -item.decimals
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
          <Deposit handleClose={handleClose} item={itemDeposit} />
        </Dialog>
        <Dialog open={openDialog2} onClose={handleClose2}>
          <Withdraw handleClose2={handleClose2} item={itemWithdraw} />
        </Dialog>
        <Dialog open={openSwapWrapNear} onClose={handleCloseWrap} maxWidth='sm' fullWidth>
          <WrapNear handleClose={handleCloseWrap} nearBalance={nearBalance} />
        </Dialog>
      </TableContainer>
    </Stack>
  );
};

export default AccountPage;
