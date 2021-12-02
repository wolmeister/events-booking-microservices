import { Resolvers } from '@generated/resolvers-types';
import { userGrpcClient } from './grpc/user-grpc-client';
import { inscriptionGrpcClient } from './grpc/inscription-grpc-client';

export const resolvers: Resolvers = {
  Mutation: {
    signupAndCheckin: async (parent, data, context) => {
      // @TODO: Handle errors
      const user = await userGrpcClient.fastSignup({
        email: data.email,
        cpf: data.cpf,
      });
      const inscription = await inscriptionGrpcClient.register({
        userId: user.id,
        eventId: data.eventId,
      });
      const checkedInInscription = await inscriptionGrpcClient.checkin({
        id: inscription.id,
      });

      return {
        id: checkedInInscription.id,
      };
    },
  },
};
