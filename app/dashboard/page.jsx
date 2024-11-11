"use client"
import axios from "axios";
import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useSearchParams } from "react-router-dom";

export default function Dashboard() {
  const [cookies, setCookie] = useCookies(["access_token", "refresh_token"]);
  const searchParams = useSearchParams();
  const code = searchParams.get('code')

  useEffect(() => {
    const onLoad = async () => {
      try {
        const axios = require("axios");
        const qs = require("qs");
        let data = qs.stringify({
          code: `${code}`,
          client_id: process.env.NEXT_PUBLIC_UPSTOX_CLIENT_ID,
          client_secret: process.env.NEXT_PUBLIC_UPSTOX_CLIENT_SECRET,
          grant_type: "authorization_code",
          redirect_uri:
            "https://sentinel-gautam-ranas-projects.vercel.app/dashboard",
        });
        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "https://api.upstox.com/v2/login/authorization/token",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
          data: data,
        };

        axios(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
          })
          .catch((error) => {
            console.log(error);
          });

        let expires = new Date();
        expires.setTime(expires.getTime() + data.expires_in * 1000);
        setCookie("access_token", data.access_token, {
          path: "/",
          expires,
        });
      } catch (error) {
        console.error("Request failed:", error);
      }
    };

    onLoad();
  }, [setCookie]);

  return <div>Dashboard</div>;
}
