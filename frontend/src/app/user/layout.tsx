"use client";

import { useEffect, useState } from "react";
import "../globals.css";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { UserProvider } from "@/context/UserContext";
import { Toaster } from "react-hot-toast";
import SideNav from "./SideNav";
import Script from "next/script";

const Component = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <title>VaultPay – Secure Digital Wallet & Smart Payment Platform</title>
        <meta
          name="description"
          content="VaultPay is a secure digital wallet platform for fast payments, wallet management, money transfers, and bill payments, built with enterprise-grade security and modern web technologies."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <Script
          id="razorpay-checkout-js"
          src="https://checkout.razorpay.com/v1/checkout.js"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`antialiased roboto-condensed`}>
        <div className="absolute top-0 left-0 right-0 z-50">
          <Toaster />
        </div>
        <SideNav>{children}</SideNav>
      </body>
    </html>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <UserProvider>
        <Component>{children}</Component>
      </UserProvider>
    </AuthProvider>
  );
}
