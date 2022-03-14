import { NavLink } from 'react-router-dom'
import styled from 'styled-components/macro'

const BoxSidebar = styled.div`
    max-width: 250px;
    position: fixed;
    width: 12vw;
    left: 0;
    top: 6rem;
    min-width: 180px;
    transition: left 0.25s;

    @media (max-width: 1240px) {
        display: none;
    }
`

const StyledNav = styled.nav`
    max-height: 80vh;
    height: 100%;
    padding-left: 2rem;
    padding-top: 0;
    max-width: 350px;
    width: 100%;
    cursor: pointer;
    @media (min-width: 1920px) {
        max-width: 400px;
    }
    @media (min-width: 2200px) {
        max-width: 500px;
    }
    .sub-trade {
        display: none;
        border-radius: 3px;
        padding-top: 10px;
        ul {
            padding-left: 0;
            li {
                margin-bottom: 10px;
                a {
                    text-decoration: none;
                }
            }
        }
    }

    @media (min-width: 1281px) {
        padding-left: 4vw;
    }
    @media (min-width: 1026px) {
        display: block;
    }
`;

const WrapperNav = styled.div`
    max-height: 60vh;
    height: 100%;
    .disabled {
        opacity: 0.3 !important;
        z-index: -1 !important;
        pointer-events: none !important;
        ::after {
            display: none;
        }
    }
`

const StyledLink = styled(NavLink)`
    font-weight: 500;
    position: relative;
    display: flex;
    font-size: 18px;
    text-decoration: none !important;
    margin-top: 2.5rem;
    text-shadow: 0 0 64px rgb(192 219 255 / 48%),
                0 0 16px rgb(65 120 255 / 24%);
    align-items: center;

    &::after {
        content: "";
        display: block;
        position: absolute;
        bottom: -5px;
        left: 60%;
        right: 40%;
        transition: all 0.4s;
        border-radius: 25px;
    }

    &:hover {
        ::after {
            left: 0;
        }
    }

    span {
        font-size: 16px;
        margin-right: 10px;
        display: flex;
        align-items: center;
        img {
            width: 20px;
        }
    }
`

const Sidebar = () => {
    return (
        <BoxSidebar>
            <StyledNav>
                <WrapperNav>
                    <StyledLink exact="true" to="/">
                        <img src="./pools-light.svg" alt=""/>
                        <span>Pools</span>
                    </StyledLink>
                </WrapperNav>
            </StyledNav>
        </BoxSidebar>
    )
}

export default Sidebar