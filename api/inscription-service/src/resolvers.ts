import { DateTimeResolver } from 'graphql-scalars';
import { PrismaClient, Inscription as PrismaInscription } from '@prisma/client';

import { Resolvers, Inscription } from '@generated/resolvers-types';
import { eventGrpcClient } from './grpc/grpc-client';

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
  Query: {
    inscriptions: async (parent, data, context) => {
      const results = await prisma.inscription.findMany({
        where: { userId: context.auth.userId },
      });
      return results.map(mapPrismaInscription);
    },
  },
  Mutation: {
    register: async (parent, data, context) => {
      console.log('register', data);

      const event = await eventGrpcClient.getEvent({ id: data.eventId });
      console.log('event', event);
      throw new Error('aff');
    },
  },
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
