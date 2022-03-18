import React from "react";
import { StateProvider } from "../../src/common/StateProvider";
import AccountPage from "./Account";

const AccountPageContainer = () => {
  const initialState = {
    loading: false,
   
  };
  const reducer = (state, action) => {
    switch (action.type) {
      case "LOADING":
        return {
          ...state,
          loading: action.newLoading,
        };
      

      default:
        break;
    }
  };
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <AccountPage />
    </StateProvider>
  );
};
export default AccountPageContainer;