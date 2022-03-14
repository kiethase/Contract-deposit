import styled from 'styled-components/macro'
import Menu from 'components/Menu'
import { ButtonBackground } from 'components/Buttons'
import { login, logout } from '../../services/near'
import { useContext } from 'react'
import { AuthContext } from '../../context/authContext'

const DetailCover = styled.div`
    display: flex;
    flex-direction: row;
    -webkit-box-align: center;
    align-items: center;
    justify-self: flex-end;
`

const DetailFlex = styled.div`
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    gap: 5px;
`

const AccountDetails = () => {
    const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext)

    const login = () => {
        window.walletConnection.requestSignIn()
    }
      
    const logout = () => {
        window.walletConnection.signOut()
        setIsLoggedIn(false)
    }

    return (
        <DetailCover>
            <DetailFlex>
                { !isLoggedIn && <ButtonBackground onClick={ login }>Connect to NEAR wallet</ButtonBackground> }
                { isLoggedIn && <ButtonBackground onClick={ logout }>{ window.accountId }</ButtonBackground> }
                <Menu></Menu>
            </DetailFlex>
        </DetailCover>
    )
}

export default AccountDetails