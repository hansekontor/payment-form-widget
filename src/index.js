import * as dotenv from 'dotenv';
dotenv.config();
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import PaymentForm from './components/Zoid';

ReactDOM.createRoot(document.querySelector('#root')).render(
   <App/>
);