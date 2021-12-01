import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { UrqlProvider } from './providers/UrqlProvider';
import { App } from './App';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <UrqlProvider>
        <App />
      </UrqlProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
