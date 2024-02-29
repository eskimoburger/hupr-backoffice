import axios from "axios";

export const baseURL = "https://api-beacon.adcm.co.th/api";

export const fetcher = async (url: string) => {
  const accessToken = localStorage.getItem("token");

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};
