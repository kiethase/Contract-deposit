import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { StrictMode } from "react";
import AuthContextProvider from "./context/authContext";
import {initContract} from "./services/near";
import { Buffer } from 'buffer'


window.Buffer = window.Buffer || Buffer


initContract().then(() => {
  ReactDOM.render(
    <StrictMode>
      <Router>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </Router>
    </StrictMode>,
    document.getElementById("root")
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
