import { readFileSync } from 'fs';
import { join } from 'path';
import { addResolversToSchema } from 'apollo-graphql';
import { ApolloServer, gql } from 'apollo-server';
import { buildSubgraphSchema } from '@apollo/federation';
import { applyMiddleware } from 'graphql-middleware';

import { startGrpcServer } from './grpc/grpc-server';
import { referenceResolvers, resolvers } from './resolvers';
import { permissions } from './permissions';
import { Context } from './context';

const { PORT = 4001 } = process.env;

// Read and parse schema
// Middleware workaround: https://github.com/maticzav/graphql-middleware/issues/351#issuecomment-807837670
const schemaText = readFileSync(join(__dirname, 'schema.graphql')).toString('utf-8');
const typeDefs = gql(schemaText);
const rawSchema = buildSubgraphSchema([{ typeDefs, resolvers }]);
const schema = applyMiddleware(rawSchema, permissions);
addResolversToSchema(schema, referenceResolvers);

// Initialize an Apollo Server instance
const server = new ApolloServer({
  schema,
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

// Start Apollo server
server.listen({ port: PORT }).then(({ url }) => {
  console.log(`User Service ready at ${url}`);
});

// Start gRPC server
startGrpcServer().then(port => {
  console.log(`User Service gRPC ready at 127.0.0.1:${port}`);
});
