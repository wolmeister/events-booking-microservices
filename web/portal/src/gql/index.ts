/* eslint-disable */
import * as graphql from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "\n  mutation signin($email: String!, $password: String!) {\n    signin(email: $email, password: $password) {\n      token\n      user {\n        name\n      }\n    }\n  }\n": graphql.SigninDocument,
};

export function gql(source: "\n  mutation signin($email: String!, $password: String!) {\n    signin(email: $email, password: $password) {\n      token\n      user {\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation signin($email: String!, $password: String!) {\n    signin(email: $email, password: $password) {\n      token\n      user {\n        name\n      }\n    }\n  }\n"];

export function gql(source: string): unknown;
export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;