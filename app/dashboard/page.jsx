"use client";
import axios from "axios";
import { useCookies } from "react-cookie";
import qs from "qs";
import useSWR from "swr";
import { useEffect } from "react";

// Fetcher function to get data
const fetcher = async () => {
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  console.log("Authorization Code: ", code); // Log for debugging

  if (!code) {
    throw new Error("Authorization code is missing");
  }

  const data = qs.stringify({
    redirect_uri: "https://sentinel-gautam-ranas-projects.vercel.app/dashboard",
    client_secret: process.env.NEXT_PUBLIC_UPSTOX_CLIENT_SECRET,
    client_id: process.env.NEXT_PUBLIC_UPSTOX_CLIENT_ID,
    code: code,
    grant_type: "authorization_code",
  });

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.upstox.com/v2/login/authorization/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    data: data,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Ensure that errors propagate
  }
};

export default function Dashboard() {
  const [cookies, setCookie] = useCookies(["access_token"]);
  const { data, error, isLoading } = useSWR("upstox-token", fetcher); // Use a key ("upstox-token") for SWR

  // Effect to set the cookie after data is fetched
  useEffect(() => {
    if (data && data.access_token) {
      const expires = new Date();
      expires.setTime(expires.getTime() + data.expires_in * 1000);

      setCookie("access_token", data.access_token, {
        path: "/",
        expires,
      });
    }
  }, [data, setCookie]); // Only run when `data` changes

  if (error) return <div>Failed to load: {error.message}</div>;
  if (isLoading) return <div>Loading...</div>;

  return <div>Hello, {JSON.stringify(data)}</div>;
}
