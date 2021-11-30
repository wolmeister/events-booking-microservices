import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createClient, Provider } from 'urql';

import { getJwt } from './jwt';
import { App } from './App';

const client = createClient({
  // @todo: add .env
  url: 'http://localhost:4000/graphql',
  fetchOptions: () => {
    const token = getJwt();
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    };
  },
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider value={client}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
