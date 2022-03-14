import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import AccountPage from "./pages/Account";
import styled from 'styled-components'
import Header from "./components/Header/Header";



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
  return (
    <AppWrapper>
      <HeaderWrapper>
        <Header/>
      </HeaderWrapper>
      <BodyWrapper>
        <Routes>
          <Route exact path="/account" element={<AccountPage/>}/>
          <Route exact path="/" element={<HomePage/>}/>
        </Routes>
      </BodyWrapper>
    </AppWrapper>
  );
}

export default App;
