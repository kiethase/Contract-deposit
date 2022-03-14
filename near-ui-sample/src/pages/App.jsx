import Header from 'components/Header'
import Sidebar from 'components/Sidebar'
import Swap from './Swap/index'
import styled from 'styled-components'

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

const App = () => {
  console.log(window.walletConnection
    .account())
  return (
    <AppWrapper>
      <HeaderWrapper>
        <Header></Header>
        <Sidebar></Sidebar>
      </HeaderWrapper>
      {/* <BodyWrapper>
      </BodyWrapper> */}
    </AppWrapper>
  )
}

export default App;
