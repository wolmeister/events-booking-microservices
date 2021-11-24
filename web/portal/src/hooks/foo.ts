import { gql } from '@apollo/client';

const SIGNIN_MUTATION = gql(/* GraphQL */ `
  mutation sigin($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      token
      user {
        name
      }
    }
  }
`);
