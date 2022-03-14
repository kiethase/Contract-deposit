import Button from "@mui/material/Button";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { Link } from "react-router-dom";

const HomePage = () => {
  console.log(window.walletConnection.isSignedIn());
  const loginNearWallet = () => {
    window.walletConnection.requestSignIn();
  };

  return (
    <div>
      {window.walletConnection.isSignedIn()?(
           <Button
           variant="contained"
         
          
           sx={{ bgcolor: "#287FD1" }}
           component={Link}
           to="/account"
         >
           View Account
         </Button>
      ):(
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
