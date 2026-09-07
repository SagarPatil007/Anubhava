"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  Menu,
  MoveRight,
  X,
} from "lucide-react";
import { AuthModal } from "@/components/auth-modal";

const menuItems = {
  Products: [
    { label: "Workspace", description: "Bring every project into focus" },
    { label: "Automations", description: "Make the busywork disappear" },
    { label: "Analytics", description: "See what moves your team forward" },
  ],
  Resources: [
    { label: "Customer stories", description: "Ideas from teams in the wild" },
    { label: "Guides", description: "Practical notes for better work" },
    { label: "Help center", description: "Answers when you need them" },
  ],
};

export function SiteNavbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openMobileMenu, setOpenMobileMenu] = useState<string | null>(null);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDrawerOpen(false);
        setOpenMenu(null);
        setAuthMode(null);
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setOpenMobileMenu(null);
  };

  const openAuth = (mode: "login" | "signup") => {
    closeDrawer();
    setAuthMode(mode);
  };

  return (
    <header className="relative z-50 border-b border-[#d8ded8] bg-[#f5f7f2]/90">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6 lg:px-10"
      >
        <a
          href="#top"
          className="flex items-center gap-3 text-[#173b35]"
          aria-label="Anubhava home"
        >
          <span className="grid size-9 place-items-center rounded-full bg-[#173b35] text-lg font-semibold text-[#f5f7f2]">
            N
          </span>
          <span className="font-serif text-[1.45rem] tracking-[-0.02em]">
            Anubhava
          </span>
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {Object.entries(menuItems).map(([label, items]) => (
            <div key={label} className="relative">
              <button
                type="button"
                aria-expanded={openMenu === label}
                onClick={() => setOpenMenu(openMenu === label ? null : label)}
                className="flex items-center gap-1.5 py-6 text-sm font-medium text-[#45615a] transition-colors hover:text-[#173b35]"
              >
                {label}
                <ChevronDown
                  aria-hidden="true"
                  className={`size-4 transition-transform ${openMenu === label ? "rotate-180" : ""}`}
                />
              </button>
              {openMenu === label && (
                <div className="absolute left-1/2 top-[62px] w-72 -translate-x-1/2 border border-[#d8ded8] bg-[#fbfcf8] p-2 shadow-[0_16px_38px_rgba(23,59,53,0.12)]">
                  {items.map((item) => (
                    <a
                      key={item.label}
                      href="#details"
                      onClick={() => setOpenMenu(null)}
                      className="group flex items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-[#e9efe8]"
                    >
                      <span>
                        <span className="block text-sm font-semibold text-[#173b35]">
                          {item.label}
                        </span>
                        <span className="mt-1 block text-xs text-[#6d7e76]">
                          {item.description}
                        </span>
                      </span>
                      <MoveRight
                        aria-hidden="true"
                        className="size-4 -translate-x-1 text-[#da6b43] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <a
            href="#about"
            className="py-6 text-sm font-medium text-[#45615a] transition-colors hover:text-[#173b35]"
          >
            About us
          </a>
        </div>

        <div className="hidden items-center gap-5 lg:flex">
          <button
            type="button"
            onClick={() => openAuth("login")}
            className="text-sm font-medium text-[#45615a] hover:text-[#173b35]"
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => openAuth("signup")}
            className="inline-flex items-center gap-2 bg-[#da6b43] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#bd5835]"
          >
            Start a project <ArrowUpRight aria-hidden="true" className="size-4" />
          </button>
        </div>

        <button
          type="button"
          aria-label={isDrawerOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isDrawerOpen}
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className="grid size-11 place-items-center text-[#173b35] lg:hidden"
        >
          {isDrawerOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </nav>

      {isDrawerOpen && (
        <div className="fixed inset-0 top-[76px] bg-[#173b35]/20 lg:hidden" onClick={closeDrawer}>
          <div
            role="dialog"
            aria-label="Mobile navigation"
            className="absolute right-0 top-0 h-[calc(100vh-76px)] w-[min(88vw,390px)] overflow-y-auto bg-[#fbfcf8] px-6 pb-8 pt-5 shadow-[-12px_0_32px_rgba(23,59,53,0.12)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-[#d8ded8] pb-5 text-xs font-semibold uppercase tracking-[0.16em] text-[#da6b43]">
              Explore Anubhava
            </div>
            <div className="divide-y divide-[#d8ded8]">
              {Object.entries(menuItems).map(([label, items]) => (
                <div key={label}>
                  <button
                    type="button"
                    aria-expanded={openMobileMenu === label}
                    onClick={() =>
                      setOpenMobileMenu(openMobileMenu === label ? null : label)
                    }
                    className="flex w-full items-center justify-between py-5 text-left text-lg font-semibold text-[#173b35]"
                  >
                    {label}
                    <ChevronDown
                      aria-hidden="true"
                      className={`size-5 text-[#da6b43] transition-transform ${openMobileMenu === label ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openMobileMenu === label && (
                    <div className="-mt-1 space-y-1 pb-4">
                      {items.map((item) => (
                        <a
                          key={item.label}
                          href="#details"
                          onClick={closeDrawer}
                          className="block bg-[#e9efe8] px-4 py-3 text-sm text-[#45615a]"
                        >
                          <span className="block font-semibold text-[#173b35]">{item.label}</span>
                          <span className="mt-1 block text-xs">{item.description}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <a
                href="#about"
                onClick={closeDrawer}
                className="block py-5 text-lg font-semibold text-[#173b35]"
              >
                About us
              </a>
            </div>
            <div className="mt-7 grid gap-3">
              <button
                type="button"
                onClick={() => openAuth("login")}
                className="border border-[#b8c4b9] px-5 py-3.5 text-center text-sm font-semibold text-[#173b35]"
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => openAuth("signup")}
                className="inline-flex items-center justify-center gap-2 bg-[#da6b43] px-5 py-3.5 text-sm font-semibold text-white"
              >
                Start a project <ArrowUpRight aria-hidden="true" className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      {authMode && (
        <AuthModal
          key={authMode}
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onModeChange={setAuthMode}
        />
      )}
    </header>
  );
}
