"use client";

import { motion } from "framer-motion";
import {
  IconShieldLock,
  IconWallet,
  IconReplace,
  IconReceipt2,
  IconArrowRight,
  IconBrandGithub,
  IconCircleCheck,
} from "@tabler/icons-react";
import Link from "next/link";

export default function VaultPayLanding() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content font-sans">
      <section className="hero min-h-screen bg-base-100 overflow-hidden">
        <div className="hero-content flex-col lg:flex-row-reverse gap-12 max-w-7xl">
          {/* Visual Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/2 relative"
          >
            <div className="mockup-code bg-neutral text-neutral-content shadow-2xl border border-white/10">
              <pre data-prefix="$">
                <code>npm install @vaultpay/sdk</code>
              </pre>
              <pre data-prefix=">" className="text-warning">
                <code>installing dependencies...</code>
              </pre>
              <pre data-prefix=">" className="text-success">
                <code>done. 0.02ms latency</code>
              </pre>
            </div>
            {/* Floating Card UI for futuristic feel */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 card bg-base-200 shadow-2xl border border-primary/20 p-6 hidden md:block"
            >
              <div className="flex items-center gap-4">
                <div className="avatar placeholder">
                  <div className="bg-success text-success-content rounded-full w-10 flex items-center justify-center">
                    <IconCircleCheck size={20} />
                  </div>
                </div>
                <div>
                  <div className="text-xs opacity-50 font-bold uppercase">
                    Payment Verified
                  </div>
                  <div className="font-mono text-lg tracking-tight">
                    $42,900.00
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/2 text-left"
          >
            <div className="badge badge-primary badge-outline mb-6 gap-2 py-4 px-6 font-bold uppercase tracking-widest text-xs">
              Next-Gen Infrastructure
            </div>
            <h1 className="text-6xl xl:text-7xl font-black leading-none mb-6">
              Secure Digital <span className="text-primary italic">Wallet</span>{" "}
              for Modern Payments
            </h1>
            <p className="text-xl opacity-70 mb-10 leading-relaxed max-w-lg">
              Empowering developers and enterprises with a programmable ledger,
              lightning-fast settlement, and military-grade security layers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={"/sign-up"}
                className="btn btn-primary btn-lg group gap-3"
              >
                Start Integration{" "}
                <IconArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <button className="btn btn-outline btn-lg">Documentation</button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. FEATURES SECTION - GRID INTERACTIVITY */}
      <section className="py-24 bg-base-200">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center mb-20">
            <h2 className="text-4xl font-black mb-4 tracking-tight">
              Enterprise Infrastructure
            </h2>
            <div className="h-1.5 w-24 bg-primary rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <IconShieldLock />,
                title: "Secure Auth",
                desc: "JWT + BCrypt military-grade encryption for every endpoint.",
              },
              {
                icon: <IconWallet />,
                title: "Wallet Logic",
                desc: "Atomic transactions ensuring double-spending is impossible.",
              },
              {
                icon: <IconReplace />,
                title: "Real-time P2P",
                desc: "Sub-second global settlements via our proprietary mesh.",
              },
              {
                icon: <IconReceipt2 />,
                title: "Tax Ready",
                desc: "Automated ledgering and compliance reporting built-in.",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="card bg-base-100 shadow-xl border border-base-300 group hover:border-primary/50 transition-colors"
              >
                <div className="card-body">
                  <div className="w-14 h-14 bg-base-200 text-primary flex items-center justify-center rounded-2xl group-hover:bg-primary group-hover:text-primary-content transition-colors mb-4">
                    {f.icon}
                  </div>
                  <h3 className="card-title font-black italic">{f.title}</h3>
                  <p className="text-sm opacity-60 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ABOUT SECTION - STATS GRID */}
      <section className="py-24 container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-black mb-8 italic">
              Engineered for Scalability
            </h2>
            <div className="space-y-6 opacity-80 text-lg">
              <p>
                VaultPay provides the underlying infrastructure for high-growth
                fintechs. We handle the complexity of compliance and security so
                you can focus on building products.
              </p>
              <ul className="space-y-3 font-medium">
                <li className="flex items-center gap-3">
                  <IconCircleCheck className="text-success" /> PCI-DSS Level 1
                  Compliant
                </li>
                <li className="flex items-center gap-3">
                  <IconCircleCheck className="text-success" /> 256-bit AES
                  Encryption
                </li>
                <li className="flex items-center gap-3">
                  <IconCircleCheck className="text-success" /> ISO 27001
                  Certified Infrastructure
                </li>
              </ul>
            </div>
          </div>
          <div className="lg:w-1/2 w-full">
            <div className="stats stats-vertical lg:stats-horizontal shadow-2xl w-full border border-base-300">
              <div className="stat place-items-center">
                <div className="stat-title">Transactions</div>
                <div className="stat-value text-primary">2.6M</div>
                <div className="stat-desc">Per Day</div>
              </div>
              <div className="stat place-items-center">
                <div className="stat-title">Uptime</div>
                <div className="stat-value text-secondary">99.99%</div>
                <div className="stat-desc">SLA Guaranteed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CONTACT - MINIMALIST FORM */}
      <section className="py-24 bg-neutral text-neutral-content">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4 italic">
              Let&apos;s talk scale.
            </h2>
            <p className="opacity-60">
              Ready to migrate your payment stack? Our engineers are on standby.
            </p>
          </div>
          <div className="grid gap-6">
            <input
              type="text"
              placeholder="Organization Email"
              className="input input-bordered input-lg bg-transparent border-white/20 text-white w-full"
            />
            <textarea
              className="textarea textarea-bordered textarea-lg bg-transparent border-white/20 text-white w-full"
              placeholder="Project details..."
            ></textarea>
            <button className="btn btn-primary btn-lg">
              Request Beta Access
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
