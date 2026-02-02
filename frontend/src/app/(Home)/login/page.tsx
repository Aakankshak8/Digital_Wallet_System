"use client";

import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  // State Management
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Unified change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    if (!formData.email.trim() || !formData.email.includes("@")) {
      newErrors.email = "Please enter a valid corporate email address";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Invalid credentials format");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/auth/login", formData);
      const { userId, fullName, email: userEmail, token, role } = response.data;

      login({ userId, fullName, email: userEmail, role }, token);
      localStorage.setItem("jwtToken", token);

      toast.success(`Welcome back, ${fullName}`);
      router.push("/user/dashboard");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Authentication failed";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-8 sm:p-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black italic tracking-tighter uppercase mb-2">
              VaultPay
            </h1>
            <p className="text-sm opacity-60 font-medium">
              Enterprise Authentication Portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-2">
            {/* Email Fieldset */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend font-bold">
                Corporate Email
              </legend>
              <input
                name="email"
                type="email"
                className={`input w-full ${errors.email ? "input-error" : ""}`}
                placeholder="admin@enterprise.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <p className="label text-xs">
                {errors.email ? (
                  <span className="text-error">{errors.email}</span>
                ) : (
                  "Authorized personnel only"
                )}
              </p>
            </fieldset>

            {/* Password Fieldset */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend font-bold">
                Access Password
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
                  <Link href="#" className="hover:underline">
                    Forgot password?
                  </Link>
                )}
              </p>
            </fieldset>

            <div className="pt-2">
              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg shadow-lg shadow-primary/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Authenticating...
                  </>
                ) : (
                  "Login to Vault"
                )}
              </button>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm opacity-70">
                New to the platform?{" "}
                <Link href="/register" className="link link-primary font-bold">
                  Request Access
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
