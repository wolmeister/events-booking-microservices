import {
  Server,
  ServerCredentials,
  loadPackageDefinition,
  StatusBuilder,
  status as Status,
} from '@grpc/grpc-js';
import { load } from '@grpc/proto-loader';
import { join } from 'path';
import { promisify } from 'util';

import { ProtoGrpcType } from '@generated/proto/event';
import { EventServiceHandlers } from '@generated/proto/EventService';
import { prisma } from '../prisma';

const handlersImplementation: EventServiceHandlers = {
  getEvent: async (call, callback) => {
    const event = await prisma.event.findUnique({
      where: { id: call.request.id },
    });

    if (event) {
      callback(null, {
        ...event,
        description: event.description || undefined,
        certificateTemplate: event.certificateTemplate || undefined,
        date: event.date.toISOString(),
        cancelUntil: event.cancelUntil.toISOString(),
        createdAt: event.createdAt.toISOString(),
      });
    } else {
      const status = new StatusBuilder().withCode(Status.NOT_FOUND).build();
      callback(status, null);
    }
  },
};

export async function startGrpcServer() {
  const packageDefinition = await load(join(__dirname, 'event.proto'));
  const proto = loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;

  const grpcServer = new Server();
  grpcServer.addService(proto.EventService.service, handlersImplementation);

  const bind = promisify(grpcServer.bindAsync.bind(grpcServer));
  return bind('127.0.0.1:50051', ServerCredentials.createInsecure()).then(port => {
    grpcServer.start();
    return port;
  });
}
