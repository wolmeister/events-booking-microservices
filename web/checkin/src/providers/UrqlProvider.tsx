import React, { useEffect, useState } from 'react';
import { Client, createClient, dedupExchange, fetchExchange, Provider } from 'urql';
import { offlineExchange } from '@urql/exchange-graphcache';
import { makeDefaultStorage } from '@urql/exchange-graphcache/default-storage';
import { getIntrospectionQuery } from 'graphql';
import { Spin, Typography } from 'antd';

import { getJwt } from '../jwt';

// @todo: add .env
const GRAPHQL_URL = 'http://localhost:4000/graphql';

export const UrqlProvider: React.FC = ({ children }) => {
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    async function initClient() {
      // Get json schema
      const schemaResult = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: getIntrospectionQuery(),
        }),
      }).then(res => res.json());

      // Create storage
      const storage = makeDefaultStorage({
        idbName: 'events-checkin',
        maxAge: 7,
      });

      // Create cache
      const cache = offlineExchange({
        schema: schemaResult.data,
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

      setClient(client);
    }

    initClient();
  }, []);

  if (!client) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Typography.Title>Events Checkin</Typography.Title>
        <Spin size="large" />
      </div>
    );
  }

  return <Provider value={client}>{children}</Provider>;
};
