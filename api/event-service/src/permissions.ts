import { Mutation, Query } from '@generated/resolvers-types';
import { IRules, rule, shield } from 'graphql-shield';

import { Context } from './context';

type PermissionsSchema = IRules & {
  Query: Partial<Record<keyof Query | '*', IRules>>;
  Mutation: Partial<Record<keyof Mutation | '*', IRules>>;
};

const isAuthenticated = rule()((parent, args, { auth }: Context) => {
  return auth !== null;
});

const permissionsSchema: PermissionsSchema = {
  Query: {},
  Mutation: {},
};

export const permissions = shield(permissionsSchema);
