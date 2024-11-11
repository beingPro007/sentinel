"use client"
import axios from "axios";
import React, { useEffect } from "react";
import { useCookies } from "react-cookie";

export default function Dashboard() {
  const [cookies, setCookie] = useCookies(["access_token", "refresh_token"]);

  useEffect(() => {
    const onLoad = async () => {
      try {
        const response = await axios.post(
          "https://api.upstox.com/v2/login/authorization/token"
        );

        if (response.status !== 200) {
          console.error("Error:", response.statusText);
          return;
        }

        const data = response.data;
        console.log(data);

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
