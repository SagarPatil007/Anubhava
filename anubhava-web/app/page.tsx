"use client";

import { useState } from "react";

import { AuthModal } from "@/components/auth-modal";
import { EventsHome } from "@/components/events-home";

export default function Home() {
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);

  return (
    <div className="min-h-full bg-[#f5f7f2] text-[#173b35]">
      <EventsHome onLogin={() => setAuthMode("login")} />
      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onModeChange={setAuthMode}
        />
      )}
    </div>
  );
}
