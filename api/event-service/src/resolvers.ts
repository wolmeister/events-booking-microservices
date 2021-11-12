import { DateResolver } from 'graphql-scalars';
import { PrismaClient } from '@prisma/client';

import { Resolvers } from '@generated/resolvers-types';

const prisma = new PrismaClient();

export const resolvers: Resolvers = {
  Date: DateResolver,
  Query: {},
  Mutation: {},
};
