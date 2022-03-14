import './index.css'
import styled from 'styled-components'

const LogoCover = styled.a`
    display: flex;
    align-items: center;
    justify-self: flex-start;
    margin-right: 12px;
    transition: transform 0.3s ease 0s;
    cursor: pointer;
`

const Logo = () => {
    return (
        <LogoCover>
            <img src="./logo-dark.png" alt="" id="logo-desktop_ipad"/>
        </LogoCover>
    )
}

export default Logo