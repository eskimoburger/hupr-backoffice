import { createContext } from "react";

interface AuthContextProps {
  token: string | null;
  login: (token: string, refreshToken: string, user: string) => void;
  logout: () => void;
  isLogin: boolean;
  isLoading: boolean;
  refreshToken: string | null;
  user: string | null;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);
export default AuthContext;
