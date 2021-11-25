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

const SIGNUP_MUTATION = gql(/* GraphQL */ `
  mutation signup($cpf: String!, $email: String!, $name: String!, $password: String!) {
    signup(cpf: $cpf, email: $email, name: $name, password: $password) {
      token
      user {
        name
      }
    }
  }
`);

type SigninMutationTypes = ExtractNodeTypes<typeof SIGNIN_MUTATION>;
type SigninResponse = SigninMutationTypes[0]['signin'];
type SigninRequest = SigninMutationTypes[1];

type SignupMutationTypes = ExtractNodeTypes<typeof SIGNUP_MUTATION>;
type SignupResponse = SignupMutationTypes[0]['signup'];
type SignupRequest = SignupMutationTypes[1];

type Auth = Pick<SigninResponse, keyof (SigninResponse | SignupResponse)>;

type AuthContextData = {
  auth: Auth | null;
  signin(signinRequest: SigninRequest): Promise<void>;
  signup(signupRequest: SignupRequest): Promise<void>;
  signout(): Promise<void>;
};

const AuthContext = createContext<AuthContextData>({
  auth: null,
  async signin() {},
  async signup() {},
  async signout() {},
});

function AuthProvider({ children }: PropsWithChildren<unknown>) {
  const apolloClient = useApolloClient();

  const [signinMutation] = useMutation(SIGNIN_MUTATION);
  const [signupMutation] = useMutation(SIGNUP_MUTATION);

  const [auth, setAuth] = useState<Auth | null>(() => {
    // TODO: Get auth from api
    const storedAuth = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
    if (storedAuth) {
      return JSON.parse(storedAuth);
    }
    return null;
  });

  const signin = useCallback(
    async (signinRequest: SigninRequest) => {
      const result = await signinMutation({ variables: signinRequest });
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

  const signup = useCallback(
    async (signupRequest: SignupRequest) => {
      const result = await signupMutation({ variables: signupRequest });
      if (result.errors) {
        throw result.errors[0];
      }
      const auth = result.data?.signup;
      if (!auth) {
        throw new Error('Error authenticating');
      }
      setAuth(auth);
      localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(auth));
    },
    [signupMutation]
  );

  const signout = useCallback(async () => {
    apolloClient.clearStore();
    setAuth(null);
    localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
  }, [apolloClient]);

  return (
    <AuthContext.Provider value={{ auth, signin, signup, signout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };
