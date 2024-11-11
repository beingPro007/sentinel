"use client";
import axios from "axios";
import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useSearchParams } from "next/navigation";
import QueryString from "qs";

export default function Dashboard() {
  const [cookies, setCookie] = useCookies(["access_token", "refresh_token"]);
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    const onLoad = async () => {
      if (!code) return; // Only execute if code is defined

      try {
        const data = QueryString.stringify({
          code,
          client_id: process.env.NEXT_PUBLIC_UPSTOX_CLIENT_ID,
          client_secret: process.env.NEXT_PUBLIC_UPSTOX_CLIENT_SECRET,
          grant_type: "authorization_code",
          redirect_uri:
            "https://sentinel-gautam-ranas-projects.vercel.app/dashboard",
        });

        const config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "https://api.upstox.com/v2/login/authorization/token",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
          data,
        };

        const response = await axios(config);
        console.log("Response data:", response.data);

        // Setting cookies with actual token and expiration
        const expires = new Date();
        expires.setTime(expires.getTime() + response.data.expires_in * 1000);
        setCookie("access_token", response.data.access_token, {
          path: "/",
          expires,
        });
      } catch (error) {
        console.error("Request failed:", error);
      }
    };

    onLoad();
  }, [setCookie, code]);

  return <div>Dashboard</div>;
}
