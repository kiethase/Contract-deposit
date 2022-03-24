import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import AccountPage from "./pages/Account";
import PoolsPage from "./pages/Pools";
import styled from 'styled-components'
import Header from "./components/Header/Header";
import * as React from "react";



const AppWrapper = styled.div`
    display: flex;
    flex-flow: column;
    align-items: flex-start;
`

const HeaderWrapper = styled.div`
    ${({ theme }) => theme.flexRowNoWrap}
    width: 100%;
    justify-content: space-between;
    position: fixed;
    top: 0;
    z-index: 2;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 120px 16px 0px;
  align-items: center;
  flex: 1;
  z-index: 1;
  min-height: calc(100vh - 100px);
`


function App() {
  const [loginState, setLoginState] = React.useState( window.walletConnection.isSignedIn());
  return (
    <AppWrapper>
      <HeaderWrapper>
        <Header setLoginState={setLoginState}/>
      </HeaderWrapper>
      <BodyWrapper>
        <Routes>
          <Route exact path="/account" element={<AccountPage loginState={loginState}/>}/>
          <Route exact path="/pools" element={<PoolsPage loginState={loginState}/>}/>
          <Route exact path="/" element={<HomePage loginState={loginState}/>}/>
        </Routes>
      </BodyWrapper>
    </AppWrapper>
  );
}

export default App;
