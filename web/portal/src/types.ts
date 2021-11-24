import { TypedDocumentNode } from '@graphql-typed-document-node/core';

export type ExtractNodeTypes<T> = T extends TypedDocumentNode<infer RES, infer REQ>
  ? [RES, REQ]
  : null;
