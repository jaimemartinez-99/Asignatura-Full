import React from 'react';
import ReactDOM from 'react-dom/client';

import {StateContext} from "./components/StateContext.mjs";
import CheckConfig from "./components/CheckConfig";

import App from './components/App.jsx';

import state from "./state.mjs";

import './css/style.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <CheckConfig>
            <StateContext.Provider value={state}>
                <App/>
            </StateContext.Provider>
        </CheckConfig>
    </React.StrictMode>,
)
