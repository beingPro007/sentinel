"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [cookies, setCookie] = useCookies(["access_token", "refresh_token"]);
  const [userProfile, setUserProfile] = useState(null);
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // OAuth Token Exchange
  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    const clientId = process.env.NEXT_PUBLIC_UPSTOX_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_UPSTOX_CLIENT_SECRET;
    const redirectUri = process.env.NEXT_PUBLIC_UPSTOX_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) return;

    if (!cookies.access_token && code) {
      const qs = require("qs");
      const data = qs.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code,
      });

      axios
        .post("https://api.upstox.com/v2/login/authorization/token", data, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
        })
        .then((res) => {
          const { access_token, refresh_token } = res.data;
          setTokenData(res.data);
          setCookie("access_token", access_token, { path: "/" });
          setCookie("refresh_token", refresh_token, { path: "/" });
          window.history.replaceState(null, "", "/dashboard");
        })
        .catch((err) => {
          const message = err.response?.data?.message || err.message;
          setError(`Token exchange failed: ${message}`);
        });
    }
  }, [cookies.access_token, setCookie]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!cookies.access_token || userProfile?.data) return;

      try {
        const res = await axios.get("/api/user", {
          headers: { Authorization: `Bearer ${cookies.access_token}` },
        });
        setUserProfile(res.data);
      } catch (err) {
        const message = err.response?.data?.message || err.message;
        setError(`Profile fetch failed: ${message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [cookies.access_token, userProfile]);

  return (
    <UserContext.Provider value={{ userProfile, loading, error }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
