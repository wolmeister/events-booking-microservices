import { eventGrpcClient } from './grpc/grpc-client';
import { prisma } from './prisma';
import {
  InvalidEventIdError,
  UserAlreadyCheckedInError,
  UserAlreadyRegisteredError,
  UserNotRegisteredError,
} from './errors';

type RegisterData = {
  eventId: string;
  userId: string;
};

export async function register(data: RegisterData) {
  // Check if the event exists
  const event = await eventGrpcClient.getEvent({ id: data.eventId });
  if (!event) {
    throw new InvalidEventIdError();
  }

  // Check if the user isn´t already registered
  const currentInscription = await prisma.inscription.findFirst({
    where: {
      userId: data.userId,
      eventId: event.id,
    },
  });
  if (currentInscription) {
    throw new UserAlreadyRegisteredError();
  }

  // @TODO: Send email
  // @TODO: Add lock
  // @TODO: Update events slots

  const createdInscription = await prisma.inscription.create({
    data: {
      eventId: data.eventId,
      userId: data.userId,
    },
  });

  return createdInscription;
}

type CheckinData = {
  id: string;
};

export async function checkin(data: CheckinData) {
  // @TODO; Only the owner should checkin

  // Check if the user is registered in the event
  const currentInscription = await prisma.inscription.findFirst({
    where: {
      id: data.id,
    },
  });
  if (!currentInscription) {
    throw new UserNotRegisteredError();
  }

  // Check if the user has already checked in
  if (currentInscription.checkintAt) {
    throw new UserAlreadyCheckedInError();
  }

  // @TODO: Add lock

  const checkedInInscription = await prisma.inscription.update({
    where: { id: currentInscription.id },
    data: { checkintAt: new Date() },
  });

  return checkedInInscription;
}
