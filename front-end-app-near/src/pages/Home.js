import Button from "@mui/material/Button";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { Link } from "react-router-dom";
import { getConfig } from "../services/config";
import * as React from "react";

const HomePage = (props) => {
  const {loginState} = props;
  const accountContract = window.contract;
  const config = getConfig("testnet");
  const accountId = JSON.parse(
    localStorage.getItem("undefined_wallet_auth_key")
  );


 
  const [checkRegis, setCheckRegis] = React.useState();

  const loginNearWallet = async () => {
    await  window.walletConnection.requestSignIn().then((response) => {console.log(response);});


  };

  const registerAccountToToken = async () => {
    await accountContract.storage_deposit(
      {
        registration_only: true,
      },
      "300000000000000",
      "100000000000000000000000",
      
    );
  };

  console.log(accountId);

  

  React.useEffect(() => {
    if (accountId !== null) {
      (async () => {
        try {
          let storageBalanceOfGet = await window.walletConnection
            .account()
            .viewFunction(config.contractName, "storage_balance_of", {
              account_id: accountId.accountId,
            });

          setCheckRegis(storageBalanceOfGet);
        } catch (error) {
          console.log("Không thể lấy danh sách cây");
        }
      })();
    }
  }, []);
  console.log(checkRegis);
  return (
    <div>
      {loginState ? (
        checkRegis !== null ? (
          <Button
            variant="contained"
            sx={{ bgcolor: "#287FD1" }}
            component={Link}
            to="/account"
          >
            View Account
          </Button>
        ) : (
          <Button
            variant="contained"
            sx={{ bgcolor: "#287FD1" }}
            onClick={registerAccountToToken}
          >
            Register Account
          </Button>
        )
      ) : (
        <Button
          variant="contained"
          onClick={() => loginNearWallet()}
          endIcon={<VpnKeyIcon />}
          sx={{ bgcolor: "#287FD1" }}
        >
          Login
        </Button>
      )}
  
    </div>
  );
};
export default HomePage;
