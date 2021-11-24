/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: any;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String'];
  user: User;
};

export type Event = {
  __typename?: 'Event';
  availableSlots: Scalars['Int'];
  cancelUntil: Scalars['DateTime'];
  certificateTemplate?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  date: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  location: Scalars['String'];
  name: Scalars['String'];
  owner: User;
  totalSlots: Scalars['Int'];
};

export type Inscription = {
  __typename?: 'Inscription';
  certificateCode?: Maybe<Scalars['String']>;
  checkintAt?: Maybe<Scalars['DateTime']>;
  createdAt: Scalars['DateTime'];
  event: Event;
  id: Scalars['ID'];
  user: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  checkIn: Inscription;
  createEvent: Event;
  register: Inscription;
  signin: AuthPayload;
  signup: AuthPayload;
};


export type MutationCheckInArgs = {
  eventId: Scalars['String'];
};


export type MutationCreateEventArgs = {
  cancelUntil: Scalars['DateTime'];
  certificateTemplate?: InputMaybe<Scalars['String']>;
  date: Scalars['DateTime'];
  description?: InputMaybe<Scalars['String']>;
  location: Scalars['String'];
  name: Scalars['String'];
  totalSlots: Scalars['Int'];
};


export type MutationRegisterArgs = {
  eventId: Scalars['String'];
};


export type MutationSigninArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationSignupArgs = {
  cpf: Scalars['String'];
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  events: Array<Event>;
  inscriptions: Array<Inscription>;
  user: User;
};

export type User = {
  __typename?: 'User';
  cpf: Scalars['String'];
  createdAt: Scalars['Date'];
  email: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type SigninMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type SigninMutation = { __typename?: 'Mutation', signin: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', name: string } } };


export const SigninDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"signin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<SigninMutation, SigninMutationVariables>;