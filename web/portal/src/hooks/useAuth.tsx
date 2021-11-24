import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';
import { useMutation, useApolloClient, gql } from '@apollo/client';
import { ExtractNodeTypes } from '../types';

const LOCAL_STORAGE_AUTH_KEY = '@events-booking/auth';

const SIGNIN_MUTATION = gql(/* GraphQL */ `
  mutation signin($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      token
      user {
        name
      }
    }
  }
`);

type SigninMutationTypes = ExtractNodeTypes<typeof SIGNIN_MUTATION>;
type Auth = SigninMutationTypes[0]['signin'];
type AuthRequest = SigninMutationTypes[1];

type AuthContextData = {
  auth: Auth | null;
  signIn(authRequest: AuthRequest): Promise<void>;
  signOut(): void;
};

const AuthContext = createContext<AuthContextData>({
  auth: null,
  async signIn() {},
  signOut() {},
});

function AuthProvider({ children }: PropsWithChildren<unknown>) {
  const apolloClient = useApolloClient();

  const [signinMutation] = useMutation(SIGNIN_MUTATION);

  const [auth, setAuth] = useState<Auth | null>(() => {
    // TODO: Get auth from api
    const storedAuth = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
    if (storedAuth) {
      return JSON.parse(storedAuth);
    }
    return null;
  });

  const signIn = useCallback(
    async (authRequest: AuthRequest) => {
      const result = await signinMutation({ variables: authRequest });
      if (result.errors) {
        throw result.errors[0];
      }
      const auth = result.data?.signin;
      if (!auth) {
        throw new Error('Error authenticating');
      }
      setAuth(auth);
      localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(auth));
    },
    [signinMutation]
  );

  const signOut = useCallback(async () => {
    apolloClient.clearStore();
    setAuth(null);
    localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
  }, [apolloClient]);

  return (
    <AuthContext.Provider value={{ auth, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };
