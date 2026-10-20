"use client";

import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";

export function LoginToast() {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState({ title: "", description: "" });

  useEffect(() => {
    const showLoginToast = () => {
      setMessage({ title: "Login successful", description: "Welcome back to Anubhava." });
      setIsVisible(true);
      window.setTimeout(() => setIsVisible(false), 4000);
    };
    const showLogoutToast = () => {
      setMessage({ title: "Logout successful", description: "Your Keycloak session has been closed." });
      setIsVisible(true);
      window.setTimeout(() => setIsVisible(false), 4000);
    };
    window.addEventListener("anubhava-login-success", showLoginToast);
    window.addEventListener("anubhava-logout-success", showLogoutToast);
    return () => {
      window.removeEventListener("anubhava-login-success", showLoginToast);
      window.removeEventListener("anubhava-logout-success", showLogoutToast);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div role="status" className="fixed right-5 top-5 z-[100] flex w-[min(90vw,360px)] items-start gap-3 border border-[#b8cdbb] bg-[#fbfcf8] p-4 text-[#173b35] shadow-[0_16px_38px_rgba(23,59,53,0.18)]">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#dbe8d9] text-[#173b35]"><Check aria-hidden="true" className="size-4" /></span>
      <div className="min-w-0 flex-1"><p className="text-sm font-semibold">{message.title}</p><p className="mt-1 text-xs text-[#5a7068]">{message.description}</p></div>
      <button type="button" aria-label="Dismiss notification" onClick={() => setIsVisible(false)} className="text-[#789087] hover:text-[#173b35]"><X aria-hidden="true" className="size-4" /></button>
    </div>
  );
}