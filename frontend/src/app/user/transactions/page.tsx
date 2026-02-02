"use client";

import { useEffect, useState } from "react";
import {
  IconSearch,
  IconFilter,
  IconArrowUpRight,
  IconArrowDownLeft,
  IconCalendar,
  IconDownload,
  IconReceipt2,
} from "@tabler/icons-react";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

interface Transaction {
  id: string;
  otherUserId: string;
  otherUserName: string;
  amount: number;
  type: string;
  status: string;
  description?: string;
  createdAt: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "Sent" | "Received">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/transactions/history");
        setTransactions(response.data);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Ledger sync failed");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter = filter === "all" || tx.type === filter;
    const matchesSearch =
      tx.otherUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <span className="loading loading-bars loading-lg text-primary"></span>
        <p className="text-xs font-bold opacity-50 tracking-widest uppercase">
          Fetching Records...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">
            Audit Ledger
          </h1>
          <p className="text-sm opacity-60 font-medium">
            Complete historical record of capital movement
          </p>
        </div>
        <button className="btn btn-outline btn-sm gap-2 uppercase tracking-widest text-[10px] font-bold">
          <IconDownload size={16} /> Export CSV
        </button>
      </div>

      {/* 2. Analytical Overview (DaisyUI Stats) */}
      <div className="stats stats-vertical lg:stats-horizontal shadow-sm border border-base-300 w-full bg-base-100">
        <div className="stat">
          <div className="stat-title font-bold uppercase tracking-widest text-[9px] opacity-60">
            Volume Outbound
          </div>
          <div className="stat-value text-error font-mono text-2xl tracking-tighter">
            ₹
            {transactions
              .filter((t) => t.type === "Sent")
              .reduce((s, t) => s + t.amount, 0)
              .toLocaleString()}
          </div>
          <div className="stat-desc font-medium">Total settled debits</div>
        </div>

        <div className="stat">
          <div className="stat-title font-bold uppercase tracking-widest text-[9px] opacity-60">
            Volume Inbound
          </div>
          <div className="stat-value text-success font-mono text-2xl tracking-tighter">
            ₹
            {transactions
              .filter((t) => t.type === "Received")
              .reduce((s, t) => s + t.amount, 0)
              .toLocaleString()}
          </div>
          <div className="stat-desc font-medium">Total settled credits</div>
        </div>

        <div className="stat">
          <div className="stat-title font-bold uppercase tracking-widest text-[9px] opacity-60">
            Record Count
          </div>
          <div className="stat-value font-mono text-2xl tracking-tighter">
            {transactions.length}
          </div>
          <div className="stat-desc font-medium">Total entries in ledger</div>
        </div>
      </div>

      {/* 3. Search & Refinement */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative grow">
          <IconSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by Counterparty or Transaction ID..."
            className="input input-bordered w-full pl-12 bg-base-100 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="join border border-base-300">
          <button
            className={`join-item btn btn-sm px-6 ${filter === "all" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`join-item btn btn-sm px-6 ${filter === "Sent" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setFilter("Sent")}
          >
            Sent
          </button>
          <button
            className={`join-item btn btn-sm px-6 ${filter === "Received" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setFilter("Received")}
          >
            Received
          </button>
        </div>
      </div>

      {/* 4. Detailed Ledger Table */}
      <div className="card bg-base-100 border border-base-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-lg">
            <thead>
              <tr className="bg-base-200/50 uppercase text-[10px] tracking-[0.2em] font-black">
                <th>Timestamp & Reference</th>
                <th>Counterparty</th>
                <th>Status</th>
                <th className="text-right">Settlement Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-20 opacity-40">
                    <IconReceipt2 size={48} className="mx-auto mb-2" />
                    <p className="font-bold uppercase tracking-widest text-xs">
                      No records matching criteria
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-base-200/30 transition-colors border-b border-base-200"
                  >
                    <td>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs font-bold opacity-70">
                          <IconCalendar size={12} />
                          {new Date(tx.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <span className="font-mono text-[10px] opacity-40 uppercase">
                          ID: {tx.id.slice(0, 12)}...
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${tx.type === "Sent" ? "bg-error/10 text-error" : "bg-success/10 text-success"}`}
                        >
                          {tx.type === "Sent" ? (
                            <IconArrowUpRight size={18} />
                          ) : (
                            <IconArrowDownLeft size={18} />
                          )}
                        </div>
                        <div>
                          <p className="font-black text-sm uppercase tracking-tight">
                            {tx.otherUserName}
                          </p>
                          <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest">
                            {tx.type === "Sent"
                              ? "Debit Settlement"
                              : "Credit Inbound"}
                          </p>
                        </div>
                      </div>
                      {tx.description && (
                        <p className="text-[11px] mt-2 opacity-60 max-w-xs">
                          {tx.description}
                        </p>
                      )}
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
                      className={`text-right font-mono font-black text-lg tracking-tighter ${
                        tx.type === "Sent" ? "text-error" : "text-success"
                      }`}
                    >
                      {tx.type === "Sent" ? "-" : "+"}₹
                      {tx.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
