import { useEffect, useState } from "react";
// import useSWR from "swr";

export default function useProvideAuth() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refreshToken")
  );
  const [isLogin, setIsLogin] = useState(
    !!JSON.parse(localStorage.getItem("isLogin") as string)
  );
  const [user, setUser] = useState<string | null>(localStorage.getItem("user"));

  const isLoading = false;
  const login = (token: string, refreshToken: string, user: string) => {
    localStorage.setItem("user", user);
    localStorage.setItem("isLogin", "true");
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    setToken(token);
    setRefreshToken(refreshToken);
    setUser(user);
    setIsLogin(true);
  };

  const logout = () => {
    localStorage.removeItem("isLogin");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.clear();
    setToken(null);
    setRefreshToken(null);
    setIsLogin(false);
    setUser(null);
  };

  // // Refresh token for persisting session
  // const { data, error, isValidating } = useSWR(
  //   isLogin ? `${process.env.REACT_APP_BACKEND}/refresh-token.php` : null,
  //   (url) =>
  //     fetch(url, {
  //       credentials: "include",
  //     }).then((res) => res.json()),
  //   {
  //     // Silently refresh token every expiry time
  //     refreshInterval: 1000 * 60 * 15,
  //     revalidateOnFocus: false,
  //   }
  // );

  // useEffect(() => {
  //   if (data) {
  //     login(data.accessToken);
  //   }
  //   if (error) {
  //     logout();
  //   }
  //   setIsLoading(isValidating);
  // }, [data, error, isValidating]);

  useEffect(() => {
    // Sync all tabs on login or logout
    window.addEventListener("storage", (e) => {
      if (e.key === "isLogin") {
        setIsLogin((e.newValue as string) === "true");
      }
    });
  });

  return { token, login, logout, isLogin, isLoading, refreshToken, user };
}
