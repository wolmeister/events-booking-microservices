import { createContext, PropsWithChildren, useContext } from 'react';
import { useMutation, gql } from '@apollo/client';
import { ExtractNodeTypes } from '../types';

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

const LOCAL_STORAGE_USER_KEY = '@events-booking/user';

const AuthContext = createContext<AuthContextData>({
  auth: null,
  async signIn() {},
  signOut() {},
});

function AuthProvider({ children }: PropsWithChildren<unknown>) {
  // const queryClient = useQueryClient();
  // const { mutateAsync: authenticateAsync } = useMutation((authRequest: AuthRequest) =>
  // http<AuthResponse>('/auth', { body: authRequest })
  // );

  const [foo] = useMutation(SIGNIN_MUTATION);
  foo({
    variables: {
      name: 'f',
    },
  });

  // const [user, setUser] = useState<User | null>(() => {
  //   // TODO: Get user from api (/api/users/me)
  //   const storedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
  //   if (storedUser) {
  //     return JSON.parse(storedUser);
  //   }
  //   return null;
  // });

  // const signIn = useCallback(
  //   async (authRequest: AuthRequest) => {
  //     const result = await authenticateAsync(authRequest);
  //     setJwt(result.token);
  //     setUser(result.user);
  //     localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(result.user));
  //   },
  //   [authenticateAsync]
  // );

  // const signOut = useCallback(() => {
  //   setUser(null);
  //   localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  //   queryClient.clear();
  // }, [queryClient]);

  return (
    <AuthContext.Provider value={{}}>
      {/* <AuthContext.Provider value={{ user, signIn, signOut }}></AuthContext.Provider> */}
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };
