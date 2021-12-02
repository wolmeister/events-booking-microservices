import { IRules, rule, shield } from 'graphql-shield';
import { Mutation } from '@generated/resolvers-types';

import { Context } from './context';

type PermissionsSchema = IRules & {
  Mutation: Partial<Record<keyof Mutation | '*', IRules>>;
};

const isAuthenticated = rule()((parent, args, { auth }: Context) => {
  return auth !== null;
});

const permissionsSchema: PermissionsSchema = {
  Mutation: {
    signupAndCheckIn: isAuthenticated,
  },
};

export const permissions = shield(permissionsSchema, {
  allowExternalErrors: true,
});
