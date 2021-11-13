import { DateTimeResolver } from 'graphql-scalars';
import { PrismaClient, Inscription as PrismaInscription } from '@prisma/client';

import { Resolvers, Inscription } from '@generated/resolvers-types';

const prisma = new PrismaClient();

function mapPrismaInscription(prismaInscription: PrismaInscription): Inscription {
  return {
    ...prismaInscription,
    user: {
      id: prismaInscription.userId,
    },
    event: {
      id: prismaInscription.eventId,
    },
  };
}

export const resolvers: Resolvers = {
  DateTime: DateTimeResolver,
  Query: {},
  Mutation: {},
};

export const referenceResolvers: Pick<Resolvers, 'Inscription'> = {
  Inscription: {
    __resolveReference: reference => {
      const { id } = reference;
      return prisma.inscription
        .findUnique({ where: { id }, rejectOnNotFound: true })
        .then(mapPrismaInscription);
    },
  },
};
