import { DateTimeResolver } from 'graphql-scalars';
import { PrismaClient, Inscription as PrismaInscription } from '@prisma/client';
import { UserInputError } from 'apollo-server';
import { Client as MinioClient } from 'minio';

import { Resolvers, Inscription } from '@generated/resolvers-types';
import { eventGrpcClient } from './grpc/grpc-client';
import { generateReport } from './drivers/report-driver';

const prisma = new PrismaClient();

// TODO: add .env
const minioClient = new MinioClient({
  endPoint: '127.0.0.1',
  port: 9000,
  useSSL: false,
  accessKey: 'minio_access_key',
  secretKey: 'minio_secret_key',
});

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
    checkIn: async (parent, data, context) => {
      // Check if the user is registered in the event
      const currentInscription = await prisma.inscription.findFirst({
        where: {
          userId: context.auth.userId,
          eventId: data.eventId,
        },
      });
      if (!currentInscription) {
        throw new UserInputError(
          'User is not registered in the event or the event id is invalid'
        );
      }

      // Check if the user has already checked in
      if (currentInscription.checkintAt) {
        throw new UserInputError('User has already checked in');
      }

      // @TODO: Add lock

      const checkedInInscription = await prisma.inscription.update({
        where: { id: currentInscription.id },
        data: { checkintAt: new Date() },
      });

      return mapPrismaInscription(checkedInInscription);
    },
    generateCertificate: async (parent, data, context) => {
      // Check if the user is registered in the event
      const inscription = await prisma.inscription.findFirst({
        where: {
          userId: context.auth.userId,
          eventId: data.eventId,
        },
      });
      if (!inscription) {
        throw new UserInputError(
          'User is not registered in the event or the event id is invalid'
        );
      }

      // Check if the user is checked in
      if (!inscription.checkintAt) {
        throw new UserInputError('User is not checked in');
      }

      // Check if the user already have a certificate
      if (inscription.certificateCode) {
        return {
          code: inscription.certificateCode,
          url: await minioClient.presignedGetObject(
            'certificates',
            `${inscription.certificateCode}.pdf`
          ),
        };
      }

      // Check if the event have a certificate
      const event = await eventGrpcClient.getEvent({ id: data.eventId });
      if (!event) {
        throw new UserInputError('Invalid event id');
      }

      if (!event.certificateTemplate) {
        return null;
      }

      // Create a new certificate
      await generateReport({
        template: event.certificateTemplate,
        bucket: '',
        name: '',
        data: {
          user: context.auth,
          event,
        },
      });

      await minioClient.putObject('certificates', body.name, pdfBuffer, {
        'Content-Type': 'application/pdf',
      });
      const url = await minioClient.presignedGetObject(body.bucket, body.name);
      return {
        url,
      };
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
