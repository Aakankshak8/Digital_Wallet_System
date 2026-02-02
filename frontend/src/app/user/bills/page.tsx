"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  IconDeviceMobile,
  IconBolt,
  IconDeviceTv,
  IconCreditCard,
  IconHistory,
  IconChevronRight,
  IconShieldCheck,
} from "@tabler/icons-react";
import axiosInstance from "@/lib/axios";
import ConfirmDialog from "@/components/ConfirmDialog";

interface BillPayment {
  id: string;
  billType: string;
  billNumber: string;
  amount: number;
  status: string;
  createdAt: string;
}

const BILL_SERVICES = [
  {
    type: "Mobile",
    icon: <IconDeviceMobile size={24} />,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    type: "Electricity",
    icon: <IconBolt size={24} />,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
  },
  {
    type: "DTH",
    icon: <IconDeviceTv size={24} />,
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
];

export default function BillsPage() {
  const [billType, setBillType] = useState("Mobile");
  const [billNumber, setBillNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [billHistory, setBillHistory] = useState<BillPayment[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchBillHistory = async () => {
      try {
        setIsLoadingHistory(true);
        const response = await axiosInstance.get("/bills/history");
        setBillHistory(response.data);
      } catch (err) {
        toast.error("Unable to sync bill records.");
      } finally {
        setIsLoadingHistory(false);
      }
    };
    fetchBillHistory();
  }, []);

  const handlePayBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!billNumber.trim()) return toast.error("Subscriber/Bill ID required");
    if (!amount || parseFloat(amount) <= 0)
      return toast.error("Invalid payment amount");
    setShowConfirm(true);
  };

  const processBillPayment = async () => {
    setShowConfirm(false);
    setIsProcessing(true);
    const loadingToast = toast.loading("Connecting to utility provider...");

    try {
      const response = await axiosInstance.post("/bills/pay", {
        billType,
        billNumber,
        amount: parseFloat(amount),
      });

      setBillHistory([response.data, ...billHistory]);
      toast.success(`Success! ₹${amount} paid to ${billType}`, {
        id: loadingToast,
      });
      setBillNumber("");
      setAmount("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Provider settlement failed", {
        id: loadingToast,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. Portal Identity */}
      <div className="border-b border-base-300 pb-6">
        <h1 className="text-4xl font-black tracking-tighter uppercase">
          Utility Settlement
        </h1>
        <p className="text-sm opacity-60 font-medium">
          Direct clearing for household & mobile services
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Form Section */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 border border-base-300 shadow-sm overflow-hidden">
            <div className="bg-neutral p-4 text-neutral-content flex items-center gap-3">
              <IconCreditCard className="text-primary" />
              <span className="text-xs font-black uppercase tracking-widest">
                Service Dispatcher
              </span>
            </div>

            <div className="card-body p-8">
              <form onSubmit={handlePayBill} className="space-y-6">
                {/* Service Selection Grid */}
                <div className="grid grid-cols-3 gap-4">
                  {BILL_SERVICES.map((service) => (
                    <button
                      key={service.type}
                      type="button"
                      onClick={() => setBillType(service.type)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2 ${
                        billType === service.type
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-base-200 hover:border-base-300 bg-base-100"
                      }`}
                    >
                      <div className={`${service.color}`}>{service.icon}</div>
                      <span className="text-[10px] font-black uppercase tracking-tight">
                        {service.type}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="divider opacity-50">ENTRY PARAMETERS</div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend font-bold">
                      Subscriber ID / Bill Number
                    </legend>
                    <input
                      type="text"
                      placeholder={`Enter ${billType} ID`}
                      className="input input-bordered w-full font-mono uppercase text-sm"
                      value={billNumber}
                      onChange={(e) => setBillNumber(e.target.value)}
                      required
                    />
                  </fieldset>

                  <fieldset className="fieldset">
                    <legend className="fieldset-legend font-bold">
                      Amount (INR)
                    </legend>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="input input-bordered w-full font-mono font-bold"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </fieldset>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-lg shadow-lg shadow-primary/20"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span className="loading loading-spinner">Routing...</span>
                  ) : (
                    "Authorize Payment"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* 3. Status Sidebar */}
        <div className="space-y-6">
          <div className="card bg-base-200 border border-base-300 shadow-sm">
            <div className="card-body p-6">
              <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2 mb-4">
                <IconShieldCheck className="text-success" size={16} />
                VaultPay Security
              </h3>
              <ul className="space-y-3 text-[11px] font-bold uppercase opacity-70">
                <li className="flex items-center gap-2">
                  ✓ Instant Settlement Engine
                </li>
                <li className="flex items-center gap-2">
                  ✓ Verified Provider Network
                </li>
                <li className="flex items-center gap-2">
                  ✓ Automatic Receipt Logging
                </li>
              </ul>
            </div>
          </div>

          <div className="alert alert-info rounded-xl border-none shadow-sm">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-wider">
                Balance Warning
              </span>
              <p className="text-xs opacity-90">
                Funds will be debited instantly from your VaultPay wallet upon
                authorization.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. History Table */}
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="p-4 border-b border-base-200 flex justify-between items-center bg-base-200/50">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
            <IconHistory size={16} className="text-primary" />
            Recent Settlements
          </h2>
          <button className="text-[10px] font-bold uppercase tracking-widest opacity-50 hover:opacity-100 flex items-center gap-1">
            View All <IconChevronRight size={12} />
          </button>
        </div>

        <div className="overflow-x-auto">
          {isLoadingHistory ? (
            <div className="flex justify-center py-20">
              <span className="loading loading-bars text-primary"></span>
            </div>
          ) : billHistory.length === 0 ? (
            <div className="text-center py-20 opacity-30 uppercase text-xs font-bold">
              No historical data available
            </div>
          ) : (
            <table className="table table-zebra w-full">
              <thead>
                <tr className="text-[10px] uppercase opacity-50 font-black tracking-widest">
                  <th>Provider</th>
                  <th>Bill Reference</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th className="text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {billHistory.map((bill) => (
                  <tr
                    key={bill.id}
                    className="hover:bg-base-200/50 transition-colors"
                  >
                    <td className="font-black uppercase tracking-tighter">
                      {bill.billType}
                    </td>
                    <td className="font-mono opacity-60">{bill.billNumber}</td>
                    <td className="font-black">
                      ₹{bill.amount.toLocaleString()}
                    </td>
                    <td>
                      <div className="badge badge-success badge-outline font-bold text-[9px] uppercase">
                        {bill.status}
                      </div>
                    </td>
                    <td className="text-right opacity-60">
                      {new Date(bill.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Execute Payment?"
        message={`Confirm settlement of ₹${amount} to ${billType} (ID: ${billNumber}). This transaction is irreversible.`}
        confirmText="Execute"
        cancelText="Abort"
        isDangerous={true}
        onConfirm={processBillPayment}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
