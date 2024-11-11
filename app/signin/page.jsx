"use client";

import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import axios from "axios";

export default function Signin() {
  const form = useForm();

  const onSubmit = () => {
    console.log("Login with Upstox clicked");

    const authUrl = "https://api.upstox.com/v2/login/authorization/dialog";
    const clientId = process.env.NEXT_PUBLIC_UPSTOX_CLIENT_ID;
    const redirectUri = "https://authenticationsfinal.vercel.app/";
    const responseType = "code";
    const state =
      "RnJpIERlYyAxNiAyMDIyIDE1OjU4OjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKQ%3D%3D";

    // Build the URL for Upstox login authorization
    const url = `${authUrl}?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;

    // Redirect the user to Upstox login
    window.location.href = url;
    
  };

  return (
    <div className="flex h-screen">
      {/* Left side with logo and quote */}
      <div className="flex-1 bg-gray-900 text-white p-10 flex flex-col justify-between">
        <div>
          <h1 className="text-5xl font-semibold mb-4">💸 Sentinel 🤑</h1>
        </div>
        <blockquote className="text-gray-400 italic">
          “More Money Buys Happiness”
          <br />
          <span className="text-gray-500">Every Fuckin Millionaire</span>
        </blockquote>
      </div>

      {/* Right side with Upstox login button */}
      <div className="flex-1 flex justify-center items-center p-10 ">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-3xl">Login</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <button
              onClick={onSubmit}
              className="w-full flex items-center justify-center border-separate"
            >
              <span className="text">Login With</span>
              <span>Upstox</span>
            </button>
          </CardContent>
          <CardFooter className="text-sm text-center">
            By clicking continue, you agree to our{" "}
            <a href="#" className="underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>
            .
          </CardFooter>
        </Card>
      </div>

      <style jsx>{`
        button {
          position: relative;
          overflow: hidden;
          border: 1px solid #18181a;
          color: #18181a;
          display: inline-block;
          font-size: 15px;
          line-height: 15px;
          padding: 18px 18px 17px;
          text-decoration: none;
          cursor: pointer;
          background: #fff;
          user-select: none;
          -webkit-user-select: none;
          touch-action: manipulation;
          border-radius: 50px; /* Rounded corners */
          transition: transform 150ms ease-out; /* Add transition for the click effect */
        }

        button span:first-child {
          position: relative;
          transition: color 600ms cubic-bezier(0.48, 0, 0.12, 1);
          z-index: 10;
        }

        button span:last-child {
          color: white;
          display: block;
          position: absolute;
          bottom: 0;
          transition: all 500ms cubic-bezier(0.48, 0, 0.12, 1);
          z-index: 100;
          opacity: 0;
          top: 50%;
          left: 50%;
          transform: translateY(225%) translateX(-50%);
          height: 14px;
          line-height: 13px;
        }

        button:after {
          content: "";
          position: absolute;
          bottom: -50%;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: black;
          transform-origin: bottom center;
          transition: transform 600ms cubic-bezier(0.48, 0, 0.12, 1);
          transform: skewY(9.3deg) scaleY(0);
          z-index: 50;
        }

        button:hover:after {
          transform-origin: bottom center;
          transform: skewY(9.3deg) scaleY(2);
          background-color: #5a2ea6; /* Updated hover color to match the image */
        }

        button:hover span:last-child {
          transform: translateX(-50%) translateY(-50%);
          opacity: 1;
          transition: all 900ms cubic-bezier(0.48, 0, 0.12, 1);
        }

        button:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
}
