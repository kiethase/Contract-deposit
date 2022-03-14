import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import App from './pages/App'
import 'index.css'
import { createGlobalStyle } from 'styled-components/macro'
import { initContract } from './services/near'
import { Buffer } from 'buffer'
import AuthContextProvider from './context/authContext'
import { HashRouter } from 'react-router-dom'

window.Buffer = window.Buffer || Buffer

const GlobalStyle = createGlobalStyle`
  body #background-app {
    background-image: url(./background_space.png);
    background-repeat: no-repeat;
    background-position: center top;
    background-size: cover;
    background-attachment: fixed;
    width: 100vw;
    height: 100vh;
    inset: 0px;
    pointer-events: none;
    z-index: -1;
  }
`

initContract().then(() => {
  ReactDOM.render(
    <StrictMode>
      <HashRouter>
        <AuthContextProvider>
          <GlobalStyle/>
          <App />
        </AuthContextProvider>
      </HashRouter>
    </StrictMode>,
  document.getElementById('root'),
  )
}).catch(console.error)