import { loadPackageDefinition, credentials, status as Status } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { join } from 'path';

import { ProtoGrpcType } from '@generated/proto/inscription';
import { CheckinRequest__Output as CheckinRequest } from '@generated/proto/CheckinRequest';
import { CheckinResponse__Output as CheckinResponse } from '@generated/proto/CheckinResponse';
import { RegisterRequest__Output as RegisterRequest } from '@generated/proto/RegisterRequest';
import { RegisterResponse__Output as RegisterResponse } from '@generated/proto/RegisterResponse';

const packageDefinition = loadSync(join(__dirname, 'inscription.proto'));
const proto = loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;

const client = new proto.InscriptionService(
  'localhost:50052',
  credentials.createInsecure()
);

export const inscriptionGrpcClient = {
  checkin: (request: CheckinRequest): Promise<CheckinResponse> => {
    return new Promise((resolve, reject) => {
      client.checkin(request, (error, result) => {
        if (error) {
          return reject(error);
        }

        if (!result) {
          return reject(new Error('Unknown internal grpc error'));
        }

        resolve(result);
      });
    });
  },
  register: (request: RegisterRequest): Promise<RegisterResponse> => {
    return new Promise((resolve, reject) => {
      client.register(request, (error, result) => {
        if (error) {
          return reject(error);
        }

        if (!result) {
          return reject(new Error('Unknown internal grpc error'));
        }

        resolve(result);
      });
    });
  },
};
