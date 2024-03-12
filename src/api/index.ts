import axios, { AxiosError } from "axios";
import { mutate } from "swr";

export const baseURL = "https://api-beacon.adcm.co.th/api";

export const fetcher = async (url: string) => {
  const accessToken = localStorage.getItem("token");

  try {
    return (
      await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    ).data;
  } catch (error) {
    const e = error as AxiosError;

    if (e.response?.status === 403 || e.response?.status === 401) {
      return refreshTokensAndRetry(url);
    }
    console.error(error);
    return null;
  }
};

export async function refreshTokensAndRetry(url: string) {
  const refreshToken = localStorage.getItem("refreshToken");
  if (refreshToken) {
    const response = await axios.get(`${baseURL}/auth/refresh`, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    console.log(response.data);
    localStorage.setItem(
      "token",
      response.data.response_data.data.access_token
    );
    localStorage.setItem(
      "refreshToken",
      response.data.response_data.data.refresh_token
    );
    return mutate(url);
  }
}
