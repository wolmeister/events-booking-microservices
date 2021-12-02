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

import { ProtoGrpcType } from '@generated/proto/inscription';
import { InscriptionServiceHandlers } from '@generated/proto/InscriptionService';
import { checkin, register } from '../controller';
import {
  InvalidEventIdError,
  UserAlreadyCheckedInError,
  UserAlreadyRegisteredError,
  UserNotRegisteredError,
} from '../errors';

const handlersImplementation: InscriptionServiceHandlers = {
  checkin: async (call, callback) => {
    try {
      const checkedInInscription = await checkin({
        id: call.request.id,
      });
      callback(null, {
        ...checkedInInscription,
        certificateCode: checkedInInscription.certificateCode || undefined,
        checkintAt: checkedInInscription.checkintAt?.toISOString(),
        createdAt: checkedInInscription.createdAt.toISOString(),
      });
    } catch (err) {
      let code = Status.INTERNAL;

      if (err instanceof UserNotRegisteredError) {
        code = Status.FAILED_PRECONDITION;
      } else if (err instanceof UserAlreadyCheckedInError) {
        code = Status.ALREADY_EXISTS;
      }

      const status = new StatusBuilder().withCode(code).build();
      callback(status, null);
    }
  },
  register: async (call, callback) => {
    try {
      const createdInscription = await register({
        eventId: call.request.eventId,
        userId: call.request.userId,
      });
      callback(null, {
        ...createdInscription,
        certificateCode: createdInscription.certificateCode || undefined,
        checkintAt: createdInscription.checkintAt?.toISOString(),
        createdAt: createdInscription.createdAt.toISOString(),
      });
    } catch (err) {
      let code = Status.INTERNAL;

      if (err instanceof InvalidEventIdError) {
        code = Status.FAILED_PRECONDITION;
      } else if (err instanceof UserAlreadyRegisteredError) {
        code = Status.ALREADY_EXISTS;
      }

      const status = new StatusBuilder().withCode(code).build();
      callback(status, null);
    }
  },
};

export async function startGrpcServer() {
  const packageDefinition = await load(join(__dirname, 'inscription.proto'));
  const proto = loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;

  const grpcServer = new Server();
  grpcServer.addService(proto.InscriptionService.service, handlersImplementation);

  const bind = promisify(grpcServer.bindAsync.bind(grpcServer));
  return bind('127.0.0.1:50052', ServerCredentials.createInsecure()).then(port => {
    grpcServer.start();
    return port;
  });
}
