import { ApolloServer } from 'apollo-server';
import { ApolloGateway } from '@apollo/gateway';

const gateway = new ApolloGateway({
  serviceList: [{ name: 'user-service', url: 'http://localhost:4001' }],
});

const server = new ApolloServer({
  gateway,
});

server
  .listen()
  .then(({ url }) => {
    console.log(`Gateway ready at ${url}`);
  })
  .catch(err => {
    console.error(err);
  });
