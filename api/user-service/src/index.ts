import { readFileSync } from 'fs';
import { join } from 'path';
import { ApolloServer, gql } from 'apollo-server';
import { buildSubgraphSchema } from '@apollo/federation';

import { resolvers } from './resolvers';

const { PORT = 4001 } = process.env;

// Read and parse schema
const schema = readFileSync(join(__dirname, 'schema.graphql')).toString('utf-8');
const typeDefs = gql(schema);

// Initialize an Apollo Server instance
const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});

// Start server
server.listen({ port: PORT }).then(({ url }) => {
  console.log(`User Service ready at ${url}`);
});
