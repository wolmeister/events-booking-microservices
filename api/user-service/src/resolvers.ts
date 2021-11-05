import { Resolvers } from '@generated/resolvers-types';

export const users = [
  {
    id: '1',
    username: 'Person Wun',
    walletId: '000-001',
  },
  {
    id: '2',
    username: 'User Tooh',
    walletId: '000-002',
  },
];

//Define resolvers
export const resolvers: Resolvers = {
  Query: {
    //Resolver for 'user' queries by ID
    user: async (parent, { id }) => {
      const userById = users.find(user => user.id === id);
      return userById!;
    },
  },
  User: {
    //Reference resolver - used by services querying user data
    //Resolver for 'user' queries by wallet ID
    __resolveReference(reference) {
      const { walletId } = reference;
      return users.find(user => user.walletId === walletId)!;
    },
  },
};
