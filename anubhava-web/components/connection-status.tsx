"use client";

import { RotateCw, Wifi, WifiOff, X } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";

type ConnectionStatus = "offline" | "reconnected" | null;

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

const subscribeToNetworkStatus = (onChange: () => void) => {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
};

const getNetworkStatus = () => navigator.onLine;

export function ConnectionStatusNotice() {
  const isOnline = useSyncExternalStore(
    subscribeToNetworkStatus,
    getNetworkStatus,
    () => true,
  );
  const [status, setStatus] = useState<ConnectionStatus>(null);
  const [dismissedStatus, setDismissedStatus] =
    useState<ConnectionStatus>(null);

  useEffect(() => {
    let isActive = true;
    let isChecking = false;
    let wasOffline = !navigator.onLine;

    const checkConnection = async () => {
      if (!navigator.onLine) {
        wasOffline = true;
        if (isActive) setStatus("offline");
        return;
      }
      if (isChecking) return;

      isChecking = true;
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 5000);

      try {
        const response = await fetch(`${apiBaseUrl}/actuator/health`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!isActive) return;
        if (!response.ok) {
          wasOffline = true;
          setStatus("offline");
        } else if (wasOffline) {
          wasOffline = false;
          setStatus("reconnected");
        } else {
          setStatus(null);
        }
      } catch {
        if (isActive) {
          wasOffline = true;
          setStatus("offline");
        }
      } finally {
        window.clearTimeout(timeoutId);
        isChecking = false;
      }
    };

    const updateOfflineStatus = () => {
      wasOffline = true;
      setStatus("offline");
    };

    const updateOnlineStatus = () => void checkConnection();
    window.addEventListener("offline", updateOfflineStatus);
    window.addEventListener("online", updateOnlineStatus);

    return () => {
      isActive = false;
      window.removeEventListener("offline", updateOfflineStatus);
      window.removeEventListener("online", updateOnlineStatus);
    };
  }, []);

  const isOffline = !isOnline || status === "offline";
  if (
    isOffline
      ? dismissedStatus === "offline"
      : status === null || status === dismissedStatus
  ) {
    return null;
  }

  const Icon = isOffline ? WifiOff : Wifi;

  return (
    <div
      role={isOffline ? "alert" : "status"}
      className={`connection-notice fixed bottom-4 right-4 z-[200] flex w-[min(90vw,420px)] flex-wrap items-center gap-x-3 gap-y-2 rounded-lg px-4 py-3 text-sm shadow-lg ${
        isOffline
          ? "bg-[#7c2d22] text-white"
          : "bg-[#173b35] text-white"
      }`}
    >
      <Icon aria-hidden="true" className="size-4 shrink-0" />
      <p>
        {isOffline
          ? "No internet connection. Check your connection and try again."
          : "Internet connection restored. Refresh the page to continue."}
      </p>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => setDismissedStatus(isOffline ? "offline" : status)}
        className="inline-flex shrink-0 items-center gap-1.5 rounded border border-white/60 px-2.5 py-1 font-medium hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <X aria-hidden="true" className="size-3.5" />
        Dismiss
      </button>
      {!isOffline && (
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-1.5 rounded border border-white/60 px-3 py-1 font-medium hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <RotateCw aria-hidden="true" className="size-3.5" />
          Refresh page
        </button>
      )}
    </div>
  );
}
