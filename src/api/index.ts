import axios from "axios";

export const fetcher = async (url: string) => {
  const accessToken = localStorage.getItem("accessToken");

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};
