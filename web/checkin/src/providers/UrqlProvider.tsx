import React from 'react';
import { createClient, dedupExchange, fetchExchange, Provider } from 'urql';
import { offlineExchange } from '@urql/exchange-graphcache';
import { makeDefaultStorage } from '@urql/exchange-graphcache/default-storage';
import { IntrospectionData } from '@urql/exchange-graphcache/dist/types/ast';

import graphqlSchema from '../assets/graphql.json';
import { getJwt } from '../jwt';

// @todo: add .env
const GRAPHQL_URL = 'http://localhost:4000/graphql';

// Create storage
const storage = makeDefaultStorage({
  idbName: 'events-checkin',
  maxAge: 7,
});

// Create cache
const cache = offlineExchange({
  schema: graphqlSchema as IntrospectionData,
  storage,
  updates: {
    /* ... */
  },
  optimistic: {
    /* ... */
  },
});

// Create client
const client = createClient({
  url: GRAPHQL_URL,
  requestPolicy: 'cache-and-network',
  fetchOptions: () => {
    const token = getJwt();
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    };
  },
  exchanges: [dedupExchange, cache, fetchExchange],
});

export const UrqlProvider: React.FC = ({ children }) => {
  return <Provider value={client}>{children}</Provider>;
};
