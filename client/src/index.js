//tao react components va mot so thu khac...
import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import App from "./App";

//bao index file bang router
import { BrowserRouter as Router } from "react-router-dom";
import { StateProvider } from "./context/StateProvider";
import { initialState } from "./context/initialState";
import reducer from "./context/reducer";


//can render app
ReactDOM.render(
    <React.StrictMode>
        <Router>
            <StateProvider initialState={initialState} reducer={reducer}>
                <App />
            </StateProvider>
        </Router>
    </React.StrictMode>
    , document.getElementById('root'))//mot cho de render