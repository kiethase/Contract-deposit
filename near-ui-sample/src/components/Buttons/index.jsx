import styled from "styled-components/macro"

export const ButtonPrimary = styled.button`
    display: flex;
    flex-flow: row nowrap;
    width: 100%;
    -webkit-box-align: center;
    align-items: center;
    padding: 0.5rem;
    border-radius: 12px;
    cursor: pointer;
    user-select: none;
    border: 1px solid white;
`

export const ButtonBackground = styled(ButtonPrimary)`
    background: linear-gradient(52deg, rgb(0, 255, 54) 7%, rgb(0, 238, 87) 17%, rgb(0, 197, 173) 37%, rgb(0, 164, 241) 52%, rgb(11, 24, 252) 88%, rgb(13, 0, 255) 94%) center center / 110%;
    color: white;
    border: 1px solid white;
    outline: none;
`