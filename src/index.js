import React from 'react';
import ReactDOM from 'react-dom';
import App from './routes/App';
import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from "../src/routes/ScrollToTop";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);


