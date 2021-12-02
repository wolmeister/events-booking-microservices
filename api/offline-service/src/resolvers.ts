import { UserInputError } from 'apollo-server';

import { Resolvers, Inscription } from '@generated/resolvers-types';
// import { eventGrpcClient } from './grpc/grpc-client';

export const resolvers: Resolvers = {
  Mutation: {
    signupAndCheckIn: async (parent, data, context) => {
      throw new UserInputError('Not implemnented yet');
    },
  },
};
