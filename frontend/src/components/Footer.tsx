"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer footer-center bg-base-200 text-base-content p-4">
      <aside>
        <p>Copyright © {currentYear} VaultPay. All rights reserved.</p>
      </aside>
    </footer>
  );
}
