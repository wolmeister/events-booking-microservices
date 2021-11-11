import { DateResolver } from 'graphql-scalars';
import { PrismaClient, User } from '@prisma/client';
import { hash, genSalt, compare } from 'bcryptjs';
import { sign as signJwt } from 'jsonwebtoken';
import { validate as validateEmail } from 'email-validator';

import { Resolvers } from '@generated/resolvers-types';
import { UserInputError } from 'apollo-server';

const prisma = new PrismaClient();

const createJwt = (user: User): string => {
  // TODO: Add env
  return signJwt({ userId: user.id }, 'ual3039', {
    algorithm: 'HS256',
    subject: String(user.id),
    expiresIn: '1d',
  });
};

export const resolvers: Resolvers = {
  Date: DateResolver,
  Query: {
    user: async (parent, data, context) => {
      return prisma.user.findUnique({
        where: { id: context.auth.userId },
        rejectOnNotFound: true,
      });
    },
  },
  Mutation: {
    signup: async (parent, data) => {
      if (!validateEmail(data.email)) {
        throw new UserInputError('Invalid email');
      }

      const salt = await genSalt();
      const password = await hash(data.password, salt);
      const user = await prisma.user.create({
        data: {
          ...data,
          password,
        },
      });

      return {
        token: createJwt(user),
        user,
      };
    },
    signin: async (parent, { email, password }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new UserInputError('Invalid email or password');
      }

      if (!(await compare(password, user.password))) {
        throw new UserInputError('Invalid email or password');
      }

      return {
        token: createJwt(user),
        user,
      };
    },
  },
  User: {
    __resolveReference: reference => {
      const { id } = reference;
      return prisma.user.findUnique({ where: { id } });
    },
  },
};
