"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  IconWallet,
  IconShieldLock,
  IconBolt,
  IconHistory,
  IconCreditCard,
} from "@tabler/icons-react";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

interface WalletData {
  id: string;
  userId: string;
  balance: number;
  createdAt: string;
}

export default function WalletPage() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch wallet data
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const response = await axiosInstance.get("/wallets");
        setWallet(response.data);
      } catch (err: any) {
        toast.error(
          err.response?.data?.message || "Failed to sync wallet ledger",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchWallet();
  }, []);

  const handleAddMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Enter a valid deposit amount");
      return;
    }

    setIsProcessing(true);
    try {
      const orderResponse = await axiosInstance.post(
        "/payments/razorpay/create-order",
        {
          amount: numAmount,
        },
      );

      const { razorpayOrderId } = orderResponse.data;

      const options = {
        key: "rzp_test_cXJvckaWoN0JQx",
        amount: numAmount * 100,
        currency: "INR",
        name: "VAULTPAY",
        description: "Capital Injection / Wallet Top-up",
        order_id: razorpayOrderId,
        handler: async (response: any) => {
          try {
            await axiosInstance.post("/payments/razorpay/verify", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            const updatedWallet = await axiosInstance.get("/wallets");
            setWallet(updatedWallet.data);
            toast.success(`₹${numAmount} successfully settled to wallet.`);
            setAmount("");
          } catch (err) {
            toast.error("Payment verification failed on ledger sync.");
          }
        },
        prefill: { email: user?.email || "" },
        theme: { color: "#111827" }, // Using dark business theme color
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      toast.error("Gateway connection failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-xs font-bold opacity-50 tracking-widest uppercase">
          Syncing Ledger...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">
            Capital Management
          </h1>
          <p className="text-sm opacity-60 font-medium">
            Verified Wallet: <span className="font-mono">{wallet?.id}</span>
          </p>
        </div>
        <Link
          href="/dashboard/transactions"
          className="btn btn-ghost btn-sm gap-2"
        >
          <IconHistory size={18} />
          View Audit Trail
        </Link>
      </div>

      {/* 2. Stats Section */}
      <div className="stats stats-vertical lg:stats-horizontal shadow-sm border border-base-300 w-full bg-base-100">
        <div className="stat">
          <div className="stat-figure text-primary">
            <IconWallet size={36} />
          </div>
          <div className="stat-title font-bold uppercase tracking-widest text-[10px]">
            Current Balance
          </div>
          <div className="stat-value text-primary font-mono tracking-tighter">
            ₹
            {wallet?.balance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </div>
          <div className="stat-desc font-medium">
            Liquid capital available for settlement
          </div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary opacity-50">
            <IconBolt size={36} />
          </div>
          <div className="stat-title font-bold uppercase tracking-widest text-[10px]">
            Settlement Speed
          </div>
          <div className="stat-value text-2xl font-black uppercase">
            Instant
          </div>
          <div className="stat-desc font-medium">RTGS / IMPS Enabled</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 3. Deposit Interface */}
        <div className="lg:col-span-2 card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body">
            <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
              <IconCreditCard className="text-primary" />
              Capital Injection
            </h2>

            <form onSubmit={handleAddMoney} className="space-y-6">
              <fieldset className="fieldset">
                <legend className="fieldset-legend font-bold">
                  Deposit Amount (INR)
                </legend>
                <input
                  type="number"
                  className="input w-full text-lg font-mono"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
                <p className="label text-xs">
                  Minimum deposit ₹1.00 • Instant balance update
                </p>
              </fieldset>

              <div className="flex flex-wrap gap-2">
                {[500, 1000, 5000, 10000].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setAmount(q.toString())}
                    className="btn btn-outline btn-sm font-mono"
                  >
                    +₹{q.toLocaleString()}
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-base-200">
                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-lg shadow-lg shadow-primary/20"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span className="loading loading-spinner">
                      Processing Gateway...
                    </span>
                  ) : (
                    "Initialize Razorpay Secure Transfer"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* 4. Security & Metadata Section */}
        <div className="space-y-6">
          <div className="card bg-base-200 border border-base-300">
            <div className="card-body">
              <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2 mb-4">
                <IconShieldLock size={16} />
                Compliance Details
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold uppercase opacity-50">
                    Authorized User
                  </p>
                  <p className="text-sm font-bold">{user?.fullName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase opacity-50">
                    Account Registered
                  </p>
                  <p className="text-sm font-bold">
                    {wallet?.createdAt
                      ? new Date(wallet.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div className="alert alert-info py-2 px-3 rounded-lg border-none bg-info/10 text-info">
                  <p className="text-[10px] leading-tight font-medium">
                    All capital injections are subject to AML monitoring and
                    real-time fraud detection protocols.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
