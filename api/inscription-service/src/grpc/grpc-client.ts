import { loadPackageDefinition, credentials, status as Status } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { join } from 'path';

import { ProtoGrpcType } from '@generated/proto/event';
import { EventRequest__Output as EventRequest } from '@generated/proto/EventRequest';
import { EventResponse__Output as EventResponse } from '@generated/proto/EventResponse';

const packageDefinition = loadSync(join(__dirname, 'event.proto'));
const proto = loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;

const client = new proto.EventService('localhost:50051', credentials.createInsecure());

export const eventGrpcClient = {
  getEvent: (request: EventRequest): Promise<EventResponse | null> => {
    return new Promise((resolve, reject) => {
      client.getEvent(request, (error, result) => {
        if (error) {
          if (error.code === Status.NOT_FOUND) {
            return resolve(null);
          }
          return reject(error);
        }

        // The event will never be null here
        resolve(result || null);
      });
    });
  },
};
