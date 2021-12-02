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

import { ProtoGrpcType } from '@generated/proto/user';
import { UserServiceHandlers } from '@generated/proto/UserService';
import { fastSignup } from '../controller';
import { InvalidEmailError } from '../errors';

const handlersImplementation: UserServiceHandlers = {
  fastSignup: async (call, callback) => {
    try {
      // @TODO: Don´t recreate if the user already exists
      const createdUser = await fastSignup({
        email: call.request.email,
        cpf: call.request.cpf,
      });
      callback(null, {
        ...createdUser,
        createdAt: createdUser.createdAt.toISOString(),
      });
    } catch (err) {
      let code = Status.INTERNAL;

      if (err instanceof InvalidEmailError) {
        code = Status.FAILED_PRECONDITION;
      }
      // @TODO: Validate existing email/cpf

      const status = new StatusBuilder().withCode(code).build();
      callback(status, null);
    }
  },
};

export async function startGrpcServer() {
  const packageDefinition = await load(join(__dirname, 'user.proto'));
  const proto = loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;

  const grpcServer = new Server();
  grpcServer.addService(proto.UserService.service, handlersImplementation);

  const bind = promisify(grpcServer.bindAsync.bind(grpcServer));
  return bind('127.0.0.1:50053', ServerCredentials.createInsecure()).then(port => {
    grpcServer.start();
    return port;
  });
}
