import { DateResolver } from 'graphql-scalars';
import { PrismaClient } from '@prisma/client';
import { Resolvers } from '@generated/resolvers-types';

const prisma = new PrismaClient();

export const resolvers: Resolvers = {
  Date: DateResolver,
  Query: {
    users: async () => {
      return prisma.user.findMany();
    },
    // user: async (parent, { id }) => {
    //   const userById = users.find(user => user.id === id);
    //   return userById!;
    // },
  },
  User: {
    __resolveReference: reference => {
      const { id } = reference;
      return null;
    },
    // __resolveReference(reference) {
    //   const { walletId } = reference;
    //   return users.find(user => user.walletId === walletId)!;
    // },
  },
};
