import { readFileSync } from 'fs';
import { join } from 'path';
import { ApolloServer, gql } from 'apollo-server';
import { buildSubgraphSchema } from '@apollo/federation';
import { applyMiddleware } from 'graphql-middleware';

import { resolvers } from './resolvers';
import { permissions } from './permissions';
import { Context } from './context';

const { PORT = 4002 } = process.env;

// Read and parse schema
const schema = readFileSync(join(__dirname, 'schema.graphql')).toString('utf-8');
const typeDefs = gql(schema);

// Initialize an Apollo Server instance
const server = new ApolloServer({
  schema: applyMiddleware(buildSubgraphSchema([{ typeDefs, resolvers }]), permissions),
  context: ({ req }): Context => {
    const { headers } = req;
    let authHeader: string | null = null;

    if (headers.auth) {
      authHeader = Array.isArray(headers.auth) ? headers.auth[0] : headers.auth;
    }

    const auth = authHeader ? JSON.parse(authHeader) : null;
    return { auth };
  },
});

// Start server
server.listen({ port: PORT }).then(({ url }) => {
  console.log(`Event Service ready at ${url}`);
});
