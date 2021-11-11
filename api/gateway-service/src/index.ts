import { ApolloGateway, RemoteGraphQLDataSource, ServiceEndpointDefinition } from '@apollo/gateway';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import expressJwt from 'express-jwt';
import http from 'http';
import retry from 'async-retry';
import isReachable from 'is-reachable';

const serviceList: Required<ServiceEndpointDefinition>[] = [
  { name: 'user-service', url: 'http://localhost:4001' },
];

async function start() {
  // Wait for all the services to be running
  await retry(
    () =>
      Promise.all(
        serviceList.map(async service => {
          if (!(await isReachable(service.url))) {
            return Promise.reject(new Error(`${service.name} not available`));
          }
        })
      ),
    { retries: 5 }
  );

  // Create express/http server
  const app = express();
  const httpServer = http.createServer(app);

  app.use(
    expressJwt({
      algorithms: ['HS256'],
      // TODO: Add env
      secret: 'ual3039',
      credentialsRequired: false,
      requestProperty: 'auth',
    })
  );

  // Create apollo gateway
  const gateway = new ApolloGateway({
    serviceList,
    buildService: ({ url }) => {
      return new RemoteGraphQLDataSource({
        url,
        willSendRequest: ({ request, context }) => {
          if ('auth' in context && context.auth) {
            request.http?.headers.set('auth', JSON.stringify(context.auth));
          }
        },
      });
    },
  });

  // Create apollo server
  const server = new ApolloServer({
    gateway,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: ({ req }) => {
      const auth = req.auth || null;
      return { auth };
    },
  });

  // Start the server
  await server.start();
  server.applyMiddleware({ app });

  httpServer.listen({ port: 4000 }, () => {
    console.log(`Gateway ready at http://localhost:4000${server.graphqlPath}`);
  });
}

start();
