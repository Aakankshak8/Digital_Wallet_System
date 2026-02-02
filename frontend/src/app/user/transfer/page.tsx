"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  IconSend,
  IconUserCircle,
  IconShieldCheck,
  IconInfoCircle,
  IconFingerprint,
  IconCurrencyRupee,
} from "@tabler/icons-react";
import { useAuth } from "@/context/AuthContext";
import ConfirmDialog from "@/components/ConfirmDialog";
import axiosInstance from "@/lib/axios";

export default function TransferPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [receiverUserId, setReceiverUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleTransferRequest = (e: React.FormEvent) => {
    e.preventDefault();

    if (!receiverUserId.trim() || receiverUserId === user?.userId) {
      toast.error(
        receiverUserId === user?.userId
          ? "Self-transfer protocol blocked"
          : "Receiver ID required",
      );
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Invalid settlement amount");
      return;
    }

    setShowConfirm(true);
  };

  const executeTransfer = async () => {
    setShowConfirm(false);
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/transactions/transfer", {
        receiverUserId,
        amount: parseFloat(amount),
        description: description || undefined,
      });

      toast.success(`Settlement Complete: ₹${amount}`);

      // Reset and redirect
      setReceiverUserId("");
      setAmount("");
      setDescription("");

      setTimeout(() => router.push("/dashboard/transactions"), 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Internal Settlement Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. Page Identity */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-base-300 pb-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">
            Peer Transfer
          </h1>
          <p className="text-sm opacity-60 font-medium">
            Instant Capital Movement Protocol
          </p>
        </div>
        <div className="badge badge-primary badge-outline font-mono py-4 px-6 text-xs font-bold uppercase tracking-widest">
          Secured by VaultPay Auth
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Main Execution Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body p-8">
              <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                <IconSend className="text-primary" />
                Transaction Parameters
              </h2>

              <form onSubmit={handleTransferRequest} className="space-y-6">
                <fieldset className="fieldset bg-base-200/50 p-6 rounded-xl border border-base-300">
                  <legend className="fieldset-legend font-bold text-primary uppercase tracking-widest text-[10px]">
                    Recipient Authentication
                  </legend>
                  <div className="relative w-full">
                    <IconUserCircle
                      className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Receiver UUID (e.g., 550e84...)"
                      className="input w-full pl-12 font-mono text-sm tracking-tighter"
                      value={receiverUserId}
                      onChange={(e) => setReceiverUserId(e.target.value)}
                      required
                    />
                  </div>
                  <p className="label text-[10px] font-bold opacity-50 uppercase mt-2">
                    Enter the unique 32-character identifier
                  </p>
                </fieldset>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend font-bold">
                      Transfer Volume (INR)
                    </legend>
                    <div className="relative">
                      <IconCurrencyRupee
                        className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30"
                        size={20}
                      />
                      <input
                        type="number"
                        placeholder="0.00"
                        className="input w-full pl-12 font-mono font-bold text-lg"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                    </div>
                  </fieldset>

                  <fieldset className="fieldset">
                    <legend className="fieldset-legend font-bold">
                      Reference Note
                    </legend>
                    <input
                      type="text"
                      placeholder="e.g., Q1 Service Invoice"
                      className="input w-full"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </fieldset>
                </div>

                <div className="pt-6 border-t border-base-200">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block btn-lg shadow-xl shadow-primary/20 group"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="loading loading-spinner">
                        Validating Ledger...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Execute Transfer Protocol
                        <IconSend
                          size={20}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* 3. Operational Protocol Sidebar */}
        <div className="space-y-6">
          <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body p-6">
              <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2 mb-6">
                <IconInfoCircle size={16} />
                Transfer Protocol
              </h3>
              <ul className="steps steps-vertical space-y-4">
                <li
                  className="step step-primary font-bold text-xs uppercase tracking-tighter"
                  data-content="1"
                >
                  ID Validation
                </li>
                <li
                  className="step step-primary font-bold text-xs uppercase tracking-tighter"
                  data-content="2"
                >
                  Balance Check
                </li>
                <li
                  className="step step-primary font-bold text-xs uppercase tracking-tighter"
                  data-content="3"
                >
                  Confirm Logic
                </li>
                <li
                  className="step font-bold text-xs uppercase tracking-tighter"
                  data-content="4"
                >
                  Ledger Write
                </li>
              </ul>
            </div>
          </div>

          <div className="card bg-neutral text-neutral-content shadow-sm">
            <div className="card-body p-6">
              <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2 mb-4 text-primary">
                <IconFingerprint size={16} />
                Your Identity
              </h3>
              <div className="space-y-4 font-mono">
                <div>
                  <p className="text-[9px] uppercase opacity-50 font-bold">
                    Terminal ID
                  </p>
                  <p className="text-xs break-all opacity-80">{user?.userId}</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-[9px] uppercase opacity-70 font-bold mb-1">
                    Security Status
                  </p>
                  <div className="flex items-center gap-2 text-success">
                    <IconShieldCheck size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      End-to-End Encrypted
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Authorize Capital Movement?"
        message={`Confirm the immediate settlement of ₹${amount} to ID ending in ...${receiverUserId.slice(-6).toUpperCase()}. This entry cannot be reversed.`}
        confirmText="Confirm Settlement"
        cancelText="Abort"
        isDangerous={true}
        onConfirm={executeTransfer}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
