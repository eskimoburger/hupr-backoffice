import { useAuth } from "@/hooks";
import { FC, PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute: FC<PropsWithChildren> = ({ children }) => {
  const { isLogin, user } = useAuth();

  if (isLogin && user) {
    return <>{children}</>;
  } else {
    return <Navigate to="/login" />;
  }
};
export default ProtectedRoute;
