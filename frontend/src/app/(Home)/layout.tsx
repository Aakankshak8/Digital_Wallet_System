"use client";
import { Toaster } from "react-hot-toast";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

function Component({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`antialiased roboto-condensed`}>
        <Toaster />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Component>{children}</Component>
    </AuthProvider>
  );
}
