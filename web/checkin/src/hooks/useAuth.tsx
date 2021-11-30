import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';
import { gql, useClient, useMutation } from 'urql';
import { ExtractNodeTypes } from '../types';
import { setJwt } from '../jwt';

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
type SigninResponse = SigninMutationTypes[0]['signin'];
type SigninRequest = SigninMutationTypes[1];

type Auth = SigninResponse;

type AuthContextData = {
  auth: Auth | null;
  signin(signinRequest: SigninRequest): Promise<void>;
  signout(): Promise<void>;
};

const AuthContext = createContext<AuthContextData>({
  auth: null,
  async signin() {},
  async signout() {},
});

function AuthProvider({ children }: PropsWithChildren<unknown>) {
  const [, signinMutation] = useMutation(SIGNIN_MUTATION);

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
      const result = await signinMutation(signinRequest);
      if (result.error) {
        throw result.error;
      }
      const auth = result.data?.signin;
      if (!auth) {
        throw new Error('Error authenticating');
      }
      setAuth(auth);
      setJwt(auth.token);
      localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(auth));
    },
    [signinMutation]
  );

  const signout = useCallback(async () => {
    setAuth(null);
    localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ auth, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };
