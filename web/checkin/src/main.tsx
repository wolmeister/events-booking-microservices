import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';

import { UrqlProvider } from './providers/UrqlProvider';
import { App } from './App';

const updateSW = registerSW({
  onNeedRefresh() {
    console.log('onNeedRefresh', arguments);
  },
  onOfflineReady() {
    console.log('onOfflineReady', arguments);
  },
  onRegistered() {
    console.log('onOfflineReady', arguments);
  },
});

console.log('updateSw', updateSW);

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
