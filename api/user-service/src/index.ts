import { ApolloServer } from 'apollo-server';
import { buildSubgraphSchema } from '@apollo/federation';

import { resolvers } from './resolvers';
import typeDefs from './schema';

const { PORT = 4001 } = process.env;

// Initialize an Apollo Server instance
const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});

// Start server
server.listen({ port: PORT }).then(({ url }) => {
  console.log(`User Service ready at ${url}`);
});
