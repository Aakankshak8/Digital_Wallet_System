"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  IconWallet,
  IconSend,
  IconPlus,
  IconReceipt,
  IconHistory,
  IconArrowUpRight,
  IconArrowDownLeft,
  IconCircleCheck,
} from "@tabler/icons-react";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import axiosInstance from "@/lib/axios";

interface WalletData {
  id: string;
  userId: string;
  balance: number;
  createdAt: string;
}

interface TransactionData {
  id: string;
  otherUserId: string;
  otherUserName: string;
  amount: number;
  type: string;
  status: string;
  description?: string;
  createdAt: string;
}

export default function DashboardHome() {
  const { user } = useAuth();
  const { setUser } = useUser();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<
    TransactionData[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [walletRes, profileRes, transRes] = await Promise.all([
          axiosInstance.get("/wallets"),
          axiosInstance.get("/users/profile"),
          axiosInstance.get("/transactions/history"),
        ]);

        setWallet(walletRes.data);
        setUser(profileRes.data);
        setRecentTransactions(transRes.data.slice(0, 5));
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Critical: System data unreachable",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [setUser]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <span className="loading loading-ring loading-lg text-primary"></span>
        <p className="text-sm font-bold opacity-50 tracking-widest uppercase">
          Securing Session...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Header & System Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Overview</h1>
          <p className="text-sm opacity-60 font-medium">
            VaultPay Enterprise Core v2.0
          </p>
        </div>
        {error ? (
          <div className="alert alert-error py-2 px-4 shadow-sm max-w-md">
            <span className="text-xs font-bold uppercase">{error}</span>
          </div>
        ) : (
          <div className="badge badge-success badge-outline gap-2 p-4 font-bold uppercase tracking-widest text-[10px]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            System Live
          </div>
        )}
      </div>

      {/* 2. Wallet Stats Card (Upgraded to DaisyUI Stats) */}
      <div className="stats stats-vertical lg:stats-horizontal shadow-xl border border-base-300 w-full bg-base-100 overflow-hidden">
        <div className="stat">
          <div className="stat-figure text-primary">
            <IconWallet size={32} />
          </div>
          <div className="stat-title font-bold uppercase tracking-tighter opacity-60">
            Liquid Balance
          </div>
          <div className="stat-value text-primary font-mono tabular-nums tracking-tighter">
            ₹
            {wallet?.balance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </div>
          <div className="stat-desc font-medium">
            Available for instant settlement
          </div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <IconCircleCheck size={32} />
          </div>
          <div className="stat-title font-bold uppercase tracking-tighter opacity-60">
            Identity Status
          </div>
          <div className="stat-value text-secondary text-2xl uppercase font-black">
            {user?.role || "Verified"}
          </div>
          <div className="stat-desc font-medium">Compliance Tier 1 Active</div>
        </div>

        <div className="stat place-items-center lg:place-items-start">
          <Link
            href="/dashboard/wallet"
            className="btn btn-primary btn-sm px-6"
          >
            Account Details
          </Link>
        </div>
      </div>

      {/* 3. Quick Actions Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Send Money",
            href: "/dashboard/transfer",
            icon: <IconSend />,
            desc: "P2P Settlement",
          },
          {
            label: "Add Funds",
            href: "/dashboard/wallet",
            icon: <IconPlus />,
            desc: "Top-up Wallet",
          },
          {
            label: "Pay Bills",
            href: "/dashboard/bills",
            icon: <IconReceipt />,
            desc: "Utilities/Tax",
          },
          {
            label: "Activity",
            href: "/dashboard/transactions",
            icon: <IconHistory />,
            desc: "Audit Ledger",
          },
        ].map((action, i) => (
          <Link
            key={i}
            href={action.href}
            className="card bg-base-100 border border-base-300 hover:border-primary/50 hover:shadow-lg transition-all group"
          >
            <div className="card-body p-6">
              <div className="bg-base-200 text-primary w-10 h-10 flex items-center justify-center rounded-lg group-hover:bg-primary group-hover:text-primary-content transition-colors">
                {action.icon}
              </div>
              <div className="mt-4">
                <h3 className="font-black text-sm uppercase tracking-tight">
                  {action.label}
                </h3>
                <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest mt-1">
                  {action.desc}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 4. Ledger Table */}
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black underline underline-offset-8 decoration-primary">
              Recent Ledger
            </h2>
            <Link
              href="/dashboard/transactions"
              className="btn btn-ghost btn-xs opacity-50 hover:opacity-100"
            >
              Audit All History
            </Link>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="text-center py-12 opacity-40">
              <IconHistory size={48} className="mx-auto mb-2" />
              <p className="font-bold uppercase tracking-widest text-xs">
                No entries found in current ledger
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-md">
                <thead>
                  <tr className="uppercase text-[10px] tracking-[0.2em] opacity-50">
                    <th>Party</th>
                    <th>Reference</th>
                    <th>Status</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="font-medium text-sm">
                  {recentTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-base-200/50 transition-colors"
                    >
                      <td className="font-bold">{tx.otherUserName}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          {tx.type === "Sent" ? (
                            <IconArrowUpRight
                              size={14}
                              className="text-error"
                            />
                          ) : (
                            <IconArrowDownLeft
                              size={14}
                              className="text-success"
                            />
                          )}
                          <span className="text-xs opacity-60 font-mono">
                            #{tx.id.slice(-6).toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div
                          className={`badge badge-sm font-bold uppercase tracking-widest text-[9px] ${
                            tx.status === "Success"
                              ? "badge-success badge-outline"
                              : "badge-ghost"
                          }`}
                        >
                          {tx.status}
                        </div>
                      </td>
                      <td
                        className={`text-right font-mono font-bold ${
                          tx.type === "Sent" ? "text-error" : "text-success"
                        }`}
                      >
                        {tx.type === "Sent" ? "-" : "+"}₹{tx.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
