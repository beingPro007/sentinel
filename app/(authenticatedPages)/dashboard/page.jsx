"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import qs from "qs";
import { useCookies } from "react-cookie";

export default function Dashboard() {
  console.log("🟢 Dashboard component mounted");
  const [cookies, setCookie] = useCookies(["access_token", "refresh_token"]);
  const [tokenData, setTokenData] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);

  // STEP 1: Exchange code for token
  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    const clientId = process.env.NEXT_PUBLIC_UPSTOX_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_UPSTOX_CLIENT_SECRET;
    const redirectUri = process.env.NEXT_PUBLIC_UPSTOX_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      console.warn("Missing Upstox env variables");
      return;
    }

    if (!cookies.access_token && code) {
      const data = qs.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code,
      });

      console.log("🔐 Exchanging code for token with:", {
        client_id: clientId,
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
          console.log("✅ Token response:", res.data);
          const { access_token, refresh_token } = res.data;

          setTokenData(res.data);
          setCookie("access_token", access_token, { path: "/" });
          setCookie("refresh_token", refresh_token, { path: "/" });

          // Remove `code` param from URL
          window.history.replaceState(null, "", "/dashboard");
        })
        .catch((err) => {
          const message = err.response?.data?.message || err.message;
          console.error("❌ Token exchange failed:", message);
          setError(`Token exchange failed: ${message}`);
        });
    }
  }, [cookies.access_token, setCookie, setError]);

  // STEP 2: Fetch user profile with access token
  useEffect(() => {
    const accessToken = cookies.access_token;
    console.log("Access Token: ", accessToken);
    
    if (!accessToken) return;

    console.log("🔑 Access token available. Fetching user profile...");

    axios
      .get("/api/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        console.log("👤 User profile received:", res.data);
        setUserProfile(res.data);
      })
      .catch((err) => {
        const message = err.response?.data?.message || err.message;
        console.error("❌ Failed to fetch user profile:", message);
        setError(`User profile fetch failed: ${message}`);
      });
  }, [cookies.access_token, setError]);

  // STEP 3: Render UI
  if (error) {
    return <div className="p-5 text-red-400 bg-zinc-900">{error}</div>;
  }

  if (!cookies.access_token && !tokenData) {
    return (
      <div className="p-5 text-white bg-zinc-900">Loading OAuth flow...</div>
    );
  }

  return (
    <div className="p-5 text-white bg-zinc-900 min-h-screen">
      <div className="mb-4">✅ Authenticated! Token ready.</div>

      {userProfile ? (
        <div>
          <h2 className="text-lg font-semibold mb-2">User Profile</h2>
          <div className="bg-zinc-800 p-4 rounded text-sm overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <tbody>
                <tr>
                  <td className="font-semibold pr-4">Email</td>
                  <td>{userProfile.data?.email || "N/A"}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-4">Exchanges</td>
                  <td>{userProfile.data?.exchanges?.join(", ") || "N/A"}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-4">Products</td>
                  <td>{userProfile.data?.products?.join(", ") || "N/A"}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-4">Broker</td>
                  <td>{userProfile.data?.broker || "N/A"}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-4">User ID</td>
                  <td>{userProfile.data?.user_id || "N/A"}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-4">User Name</td>
                  <td>{userProfile.data?.user_name || "N/A"}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-4">Order Types</td>
                  <td>{userProfile.data?.order_types?.join(", ") || "N/A"}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-4">User Type</td>
                  <td>{userProfile.data?.user_type || "N/A"}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-4">POA</td>
                  <td>{userProfile.data?.poa === true ? "Yes" : userProfile.data?.poa === false ? "No" : "N/A"}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-4">DDPI</td>
                  <td>{userProfile.data?.ddpi === true ? "Yes" : userProfile.data?.ddpi === false ? "No" : "N/A"}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-4">Active</td>
                  <td>{userProfile.data?.is_active === true ? "Yes" : userProfile.data?.is_active === false ? "No" : "N/A"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>Loading user profile...</div>
      )}
    </div>
  );
}
