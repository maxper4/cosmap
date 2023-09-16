import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import _ from "../environment"

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App rpcUrl={process.env.RPC_URL}/>
  </React.StrictMode>
);
