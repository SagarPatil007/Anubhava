"use client";

import { ChevronDown, LogOut, UserCircle } from "lucide-react";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";

type StoredUser = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

const gatewayUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  const email = window.localStorage.getItem("anubhava_user_email");
  if (!email) return null;
  return { email };
}

type UserProfileMenuProps = {
  fallback?: ReactNode;
};

export function UserProfileMenu({ fallback = null }: UserProfileMenuProps) {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const refreshUser = () => {
      const storedUser = getStoredUser();
      setUser(storedUser);
      if (storedUser?.email) {
        void fetch(`${gatewayUrl}/api/v1/users/email?email=${encodeURIComponent(storedUser.email)}`)
          .then((response) => response.json())
          .then((result: { success?: boolean; data?: StoredUser }) => {
            if (result.success && result.data) setUser(result.data);
          })
          .catch(() => undefined);
      }
    };
    refreshUser();
    window.addEventListener("storage", refreshUser);
    window.addEventListener("anubhava-auth-changed", refreshUser);
    return () => {
      window.removeEventListener("storage", refreshUser);
      window.removeEventListener("anubhava-auth-changed", refreshUser);
    };
  }, []);

  if (!user) return fallback;

  const displayName = user.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : user.email?.split("@")[0] ?? "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  const logout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    const refreshToken = window.localStorage.getItem("anubhava_refresh_token");

    try {
      if (refreshToken) {
        await fetch(`${gatewayUrl}/api/v1/auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } finally {
      window.localStorage.removeItem("anubhava_access_token");
      window.localStorage.removeItem("anubhava_refresh_token");
      window.localStorage.removeItem("anubhava_user_email");
      window.localStorage.removeItem("anubhava_user_city");
      window.dispatchEvent(new Event("anubhava-auth-changed"));
      window.dispatchEvent(new Event("anubhava-logout-success"));
      setIsOpen(false);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="relative">
      <button type="button" aria-expanded={isOpen} aria-label="Open user profile menu" onClick={() => setIsOpen((open) => !open)} className="flex items-center gap-2 text-left">
        <span className="grid size-9 place-items-center rounded-full bg-[#173b35] text-xs font-bold text-[#f5f7f2]">{initials}</span>
        <span className="hidden max-w-28 truncate text-sm font-semibold text-[#173b35] md:block">{displayName}</span>
        <ChevronDown aria-hidden="true" className={`size-4 text-[#5a7068] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-64 border border-[#d8ded8] bg-[#fbfcf8] p-2 shadow-[0_16px_38px_rgba(23,59,53,0.14)]">
          <div className="border-b border-[#d8ded8] px-3 py-3">
            <p className="truncate text-sm font-semibold text-[#173b35]">{displayName}</p>
            <p className="mt-1 truncate text-xs text-[#789087]">{user.email}</p>
          </div>
          <Link href="/profile" onClick={() => setIsOpen(false)} className="mt-1 flex items-center gap-3 px-3 py-3 text-sm font-semibold text-[#173b35] hover:bg-[#e9efe8]">
            <UserCircle aria-hidden="true" className="size-4 text-[#da6b43]" /> View profile
          </Link>
          <button type="button" onClick={() => void logout()} disabled={isLoggingOut} className="flex w-full items-center gap-3 px-3 py-3 text-left text-sm font-semibold text-[#5a7068] transition-colors hover:bg-[#e9efe8] disabled:cursor-wait disabled:opacity-60">
            <LogOut aria-hidden="true" className={`size-4 ${isLoggingOut ? "animate-spin" : ""}`} /> {isLoggingOut ? "Logging out..." : "Log out"}
          </button>
        </div>
      )}
    </div>
  );
}