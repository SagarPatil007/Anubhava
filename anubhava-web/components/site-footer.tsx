"use client";

import { ArrowUpRight, Globe, Link, Mail } from "lucide-react";

const footerGroups = [
  {
    title: "Explore",
    links: ["Products", "Resources", "About us", "Customer stories"],
  },
  {
    title: "Work with us",
    links: ["Start a project", "Careers", "Contact"],
  },
  {
    title: "Follow along",
    links: ["Instagram", "LinkedIn", "Newsletter"],
  },
];

export function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-[#d8ded8] bg-[#173b35] text-[#f5f7f2]">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_2fr] lg:gap-20">
          <div>
            <a href="#top" className="flex items-center gap-3" aria-label="Anubhava home">
              <span className="grid size-9 place-items-center rounded-full bg-[#da6b43] text-lg font-semibold text-white">
                A
              </span>
              <span className="font-serif text-[1.45rem] tracking-[-0.02em]">Anubhava</span>
            </a>
            <p className="mt-7 max-w-sm font-serif text-3xl leading-tight text-[#dbe8d9]">
              Make room for meaningful work.
            </p>
            <a href="mailto:hello@anubhava.com" className="mt-7 inline-flex items-center gap-2 text-sm text-[#b9ccc0] transition-colors hover:text-white">
              <Mail aria-hidden="true" className="size-4 text-[#da6b43]" /> hello@anubhava.com
            </a>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#da6b43]">{group.title}</h2>
                <ul className="mt-5 space-y-3">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a href={link === "Start a project" ? "#top" : "#details"} className="text-sm text-[#b9ccc0] transition-colors hover:text-white">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-5 border-t border-[#49665d] pt-6 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="text-sm font-semibold text-[#dbe8d9]">A little clarity, once a month.</p>
            <form className="mt-3 flex max-w-md border-b border-[#769087] pb-2" onSubmit={(event) => event.preventDefault()}>
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input id="footer-email" type="email" required placeholder="Your email address" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#91aaa0]" />
              <button type="submit" aria-label="Subscribe to newsletter" className="inline-flex items-center gap-2 text-sm font-semibold text-[#dbe8d9] transition-colors hover:text-white">
                Subscribe <ArrowUpRight aria-hidden="true" className="size-4 text-[#da6b43]" />
              </button>
            </form>
          </div>
          <div className="flex items-center gap-3">
            <a href="#instagram" aria-label="Instagram" className="grid size-9 place-items-center rounded-full border border-[#49665d] text-[#b9ccc0] transition-colors hover:border-[#da6b43] hover:text-white">
              <Globe aria-hidden="true" className="size-4" />
            </a>
            <a href="#linkedin" aria-label="LinkedIn" className="grid size-9 place-items-center rounded-full border border-[#49665d] text-[#b9ccc0] transition-colors hover:border-[#da6b43] hover:text-white">
              <Link aria-hidden="true" className="size-4" />
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-[#49665d] pt-5 text-xs text-[#91aaa0] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Anubhava. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#privacy" className="hover:text-white">Privacy</a>
            <a href="#terms" className="hover:text-white">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
