import { DateTimeResolver } from 'graphql-scalars';
import { PrismaClient, Inscription as PrismaInscription } from '@prisma/client';
import { UserInputError } from 'apollo-server';

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
      // Check if the event exists
      const event = await eventGrpcClient.getEvent({ id: data.eventId });
      if (!event) {
        throw new UserInputError('Invalid event id');
      }

      // Check if the user isn´t already registered
      const currentInscription = await prisma.inscription.findFirst({
        where: {
          userId: context.auth.userId,
          eventId: event.id,
        },
      });
      if (currentInscription) {
        throw new UserInputError('User already registered in the event');
      }

      // @TODO: Send email
      // @TODO: Add lock
      // @TODO: Update events slots

      const createdInscription = await prisma.inscription.create({
        data: {
          eventId: data.eventId,
          userId: context.auth.userId,
        },
      });

      return mapPrismaInscription(createdInscription);
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
