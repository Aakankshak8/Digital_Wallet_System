"use client";

import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();

  // State Management
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Input Handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear specific error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.fullName.trim().length < 2)
      newErrors.fullName = "Full name must be at least 2 characters";

    if (!formData.email.includes("@"))
      newErrors.email = "Please enter a valid business email";

    if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, "")))
      newErrors.phoneNumber = "Phone number must be exactly 10 digits";

    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the highlighted errors");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/auth/register", formData);
      const { userId, fullName: name, email, token, role } = response.data;
      localStorage.setItem("jwtToken", token);

      toast.success(`Welcome, ${name}! Account created.`);
      router.push("/login");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Registration failed.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-8 sm:p-12">
          <div className="mb-8">
            <h1 className="text-3xl font-black italic tracking-tight mb-2">
              Create Account
            </h1>
            <p className="text-sm opacity-60 font-medium">
              Join VaultPay Enterprise for secure transactions.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-2">
            {/* Full Name */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend font-bold">Full Name</legend>
              <input
                name="fullName"
                type="text"
                className={`input w-full ${errors.fullName ? "input-error" : ""}`}
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <p className="label text-xs">
                {errors.fullName ? (
                  <span className="text-error">{errors.fullName}</span>
                ) : (
                  "As it appears on your ID"
                )}
              </p>
            </fieldset>

            {/* Email */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend font-bold">Work Email</legend>
              <input
                name="email"
                type="email"
                className={`input w-full ${errors.email ? "input-error" : ""}`}
                placeholder="john@company.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <p className="label text-xs">
                {errors.email ? (
                  <span className="text-error">{errors.email}</span>
                ) : (
                  "We'll never share your email"
                )}
              </p>
            </fieldset>

            {/* Phone Number */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend font-bold">
                Phone Number
              </legend>
              <input
                name="phoneNumber"
                type="tel"
                className={`input w-full ${errors.phoneNumber ? "input-error" : ""}`}
                placeholder="9876543210"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
              <p className="label text-xs">
                {errors.phoneNumber ? (
                  <span className="text-error">{errors.phoneNumber}</span>
                ) : (
                  "10-digit mobile number"
                )}
              </p>
            </fieldset>

            {/* Password */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend font-bold">
                Security Password
              </legend>
              <input
                name="password"
                type="password"
                className={`input w-full ${errors.password ? "input-error" : ""}`}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <p className="label text-xs">
                {errors.password ? (
                  <span className="text-error">{errors.password}</span>
                ) : (
                  "Minimum 6 characters required"
                )}
              </p>
            </fieldset>

            <div className="pt-4">
              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg shadow-lg shadow-primary/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Provisioning Account...
                  </>
                ) : (
                  "Register Securely"
                )}
              </button>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm opacity-70">
                Already have an account?{" "}
                <Link href="/login" className="link link-primary font-bold">
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
