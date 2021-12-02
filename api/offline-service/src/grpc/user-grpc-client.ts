import { loadPackageDefinition, credentials, status as Status } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { join } from 'path';

import { ProtoGrpcType } from '@generated/proto/user';
import { FastSignupRequest__Output as FastSignupRequest } from '@generated/proto/FastSignupRequest';
import { FastSignupResponse__Output as FastSignupResponse } from '@generated/proto/FastSignupResponse';

const packageDefinition = loadSync(join(__dirname, 'user.proto'));
const proto = loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;

const client = new proto.UserService('localhost:50053', credentials.createInsecure());

export const userGrpcClient = {
  fastSignup: (request: FastSignupRequest): Promise<FastSignupResponse> => {
    return new Promise((resolve, reject) => {
      client.fastSignup(request, (error, result) => {
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
