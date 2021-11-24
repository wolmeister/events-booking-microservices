/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

declare module "@apollo/client" {

  export function gql(source: "\n  mutation signin($email: String!, $password: String!) {\n    signin(email: $email, password: $password) {\n      token\n      user {\n        name\n      }\n    }\n  }\n"): typeof import('./graphql').SigninDocument;
  export function gql(source: string): unknown;

    export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<    infer TType,    any  >    ? TType    : never;  
}