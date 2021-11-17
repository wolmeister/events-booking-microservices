import { DateTimeResolver } from 'graphql-scalars';
import { Event as PrismaEvent } from '@prisma/client';

import { Resolvers, Event } from '@generated/resolvers-types';
import { prisma } from './prisma';

function mapPrismaEvent(prismaEvent: PrismaEvent): Event {
  return {
    ...prismaEvent,
    owner: {
      id: prismaEvent.ownerId,
    },
  };
}

export const resolvers: Resolvers = {
  DateTime: DateTimeResolver,
  Query: {
    events: async () => {
      return (await prisma.event.findMany()).map(mapPrismaEvent);
    },
  },
  Mutation: {
    createEvent: async (parent, data, context) => {
      return prisma.event
        .create({
          data: {
            ...data,
            ownerId: context.auth.userId,
            availableSlots: data.totalSlots,
          },
        })
        .then(mapPrismaEvent);
    },
  },
};

export const referenceResolvers: Pick<Resolvers, 'Event'> = {
  Event: {
    __resolveReference: reference => {
      const { id } = reference;
      return prisma.event
        .findUnique({ where: { id }, rejectOnNotFound: true })
        .then(mapPrismaEvent);
    },
  },
};
