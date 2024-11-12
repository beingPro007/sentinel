"use client";
import axios from "axios";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import qs from "qs";
import useSWR from "swr";

const fetcher = async () => {
  const data = qs.stringify({
    redirect_uri: "https://sentinel-gautam-ranas-projects.vercel.app/dashboard",
    client_secret: process.env.NEXT_PUBLIC_UPSTOX_CLIENT_SECRET,
    client_id: process.env.NEXT_PUBLIC_UPSTOX_CLIENT_ID,
    code: "abcd",
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
    throw error;
  }
};

export default function Dashboard() {
  const [cookies, setCookie] = useCookies(["access_token"]);
  const [code, setCode] = useState("abcd");

  const { data, error, isLoading } = useSWR(
    "https://api.upstox.com/v2/login/authorization/token",
    fetcher
  );

  if (error) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;

  return <div>Hello, {JSON.stringify(data)}</div>;
}
