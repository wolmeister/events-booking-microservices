import { DateTimeResolver } from 'graphql-scalars';
import { PrismaClient, Inscription as PrismaInscription } from '@prisma/client';
import { UserInputError } from 'apollo-server';
import { Client as MinioClient } from 'minio';
import { v4 as uuid } from 'uuid';

import { Resolvers, Inscription } from '@generated/resolvers-types';
import { eventGrpcClient } from './grpc/grpc-client';
import { generateReport } from './drivers/report-driver';

const prisma = new PrismaClient();

// TODO: add .env
const minioClient = new MinioClient({
  endPoint: '177.44.248.85',
  port: 9000,
  useSSL: false,
  accessKey: 'minio_access_key',
  secretKey: 'minio_secret_key',
});

const BUCKET = 'certificates';

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
      // @TODO; Only the owner should checkin, separate in two endpoints
      const results = await prisma.inscription.findMany({
        where: {
          userId: data.eventId || data.eventId === '' ? undefined : context.auth.userId,
          eventId: data.eventId || undefined,
        },
      });
      return results.map(mapPrismaInscription);
    },
    certificate: async (parent, data) => {
      const inscription = await prisma.inscription.findFirst({
        where: { certificateCode: data.code },
      });

      if (!inscription) {
        return null;
      }

      return {
        code: data.code,
        url: await minioClient.presignedGetObject(
          BUCKET,
          `${inscription.certificateCode}.pdf`
        ),
      };
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
          userId: data.userId || context.auth.userId,
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
          userId: data.userId || context.auth.userId,
        },
      });

      return mapPrismaInscription(createdInscription);
    },
    checkIn: async (parent, data, context) => {
      // @TODO; Only the owner should checkin
      // Check if the user is registered in the event
      const currentInscription = await prisma.inscription.findFirst({
        where: {
          userId: data.userId,
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
            BUCKET,
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
      const certificateCode = uuid();
      const certificateName = `${certificateCode}.pdf`;

      const certificate = await generateReport({
        template: event.certificateTemplate,
        data: {
          user: context.auth,
          event,
          inscription: {
            ...inscription,
            certificateCode,
          },
        },
      });

      await minioClient.putObject(BUCKET, certificateName, certificate, {
        'Content-Type': 'application/pdf',
      });
      const url = await minioClient.presignedGetObject(BUCKET, certificateName);

      // Save certificate code to the inscription
      await prisma.inscription.update({
        where: { id: inscription.id },
        data: {
          certificateCode,
        },
      });

      return {
        code: certificateCode,
        url,
      };
    },
    cancel: async (parent, data, context) => {
      // Check if the event exists and still can be canceled
      const event = await eventGrpcClient.getEvent({ id: data.eventId });
      if (!event) {
        throw new UserInputError('Invalid event id');
      }

      if (new Date() >= new Date(event.cancelUntil)) {
        throw new UserInputError('The event can no longer be canceled');
      }

      // Check if the user is registered in the event
      const inscription = await prisma.inscription.findFirst({
        where: {
          userId: context.auth.userId,
          eventId: data.eventId,
        },
      });
      if (!inscription) {
        throw new UserInputError('User is not registered in the event');
      }

      // Check if the user is not checked in
      if (inscription.checkintAt) {
        throw new UserInputError('The user has already checked in');
      }

      // Delete the inscription
      await prisma.inscription.delete({
        where: { id: inscription.id },
      });

      return inscription.id;
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
