import { loadPackageDefinition, credentials } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { join } from 'path';
import { promisify } from 'util';

import { ProtoGrpcType } from '@generated/proto/event';

const packageDefinition = loadSync(join(__dirname, 'event.proto'));
const proto = loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;

const client = new proto.EventService('localhost:50051', credentials.createInsecure());

export const eventGrpcClient = {
  getEvent: promisify(client.getEvent.bind(client)),
};
