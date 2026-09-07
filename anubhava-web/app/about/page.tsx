import { ArrowLeft, ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { events } from "@/lib/events";

const principles = [
  {
    number: "01",
    title: "Make space",
    description: "We create gatherings where people can slow down, think clearly, and be present with one another.",
  },
  {
    number: "02",
    title: "Share generously",
    description: "Our talks and workshops make useful ideas accessible, practical, and easier to carry into everyday work.",
  },
  {
    number: "03",
    title: "Leave changed",
    description: "Every event should offer more than a full calendar. It should leave you with a new question, connection, or next step.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-full bg-[#f5f7f2] text-[#173b35]">
      <header className="border-b border-[#d8ded8] bg-[#fbfcf8]">
        <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-6 px-6 lg:px-10">
          <Link href="/" className="flex shrink-0 items-center gap-3 text-[#173b35]" aria-label="Anubhava home">
            <span className="grid size-9 place-items-center rounded-full bg-[#173b35] text-lg font-semibold text-[#f5f7f2]">A</span>
            <span className="font-serif text-[1.45rem] tracking-[-0.02em]">Anubhava</span>
          </Link>
          <div className="flex items-center gap-5 text-sm font-semibold">
            <Link href="/" className="text-[#5a7068] hover:text-[#173b35]">Browse events</Link>
            <Link href="/events/create" className="hidden items-center gap-2 bg-[#da6b43] px-4 py-2.5 text-white transition-colors hover:bg-[#bd5835] sm:inline-flex">Host an event <ArrowUpRight aria-hidden="true" className="size-4" /></Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-6 pb-16 pt-14 lg:px-10 lg:pb-24 lg:pt-20">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#5a7068] hover:text-[#173b35]"><ArrowLeft aria-hidden="true" className="size-4" /> Back to events</Link>
          <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#da6b43]">About Anubhava</p>
              <h1 className="mt-4 max-w-4xl font-serif text-6xl leading-[0.9] tracking-[-0.04em] text-[#173b35] sm:text-8xl">We make room for meaningful moments.</h1>
            </div>
            <p className="max-w-md text-lg leading-8 text-[#45615a]">Anubhava is a calendar of considered gatherings for people who care about good work, honest conversation, and a life with a little more attention in it.</p>
          </div>
        </section>

        <section className="border-y border-[#c7d2c8] bg-[#e9efe8]">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:px-10 lg:py-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#da6b43]">What we do</p>
              <h2 className="mt-4 max-w-sm font-serif text-5xl leading-none tracking-[-0.03em] text-[#173b35]">Gather people around better questions.</h2>
            </div>
            <div className="max-w-2xl space-y-6 text-base leading-8 text-[#45615a]">
              <p>We curate and manage intimate events across cities and disciplines: from early-morning creative sessions to practical workshops, generous talks, and evenings that make new introductions feel natural.</p>
              <p>Our work is simple to describe and difficult to fake. We find the right people, shape the setting, and protect enough space for a real exchange to happen.</p>
              <Link href="/events/create" className="inline-flex items-center gap-2 border-b border-[#da6b43] pb-1 text-sm font-semibold text-[#173b35] hover:text-[#da6b43]">Bring an event to the calendar <ArrowUpRight aria-hidden="true" className="size-4" /></Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20">
          <div className="flex flex-col justify-between gap-5 border-b border-[#c7d2c8] pb-8 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#da6b43]">Our approach</p>
              <h2 className="mt-3 font-serif text-5xl leading-none text-[#173b35]">A little more intention.</h2>
            </div>
            <p className="max-w-xs text-sm leading-6 text-[#5a7068]">The principles behind every event we manage.</p>
          </div>
          <div className="grid gap-8 pt-8 md:grid-cols-3">
            {principles.map((principle) => (
              <article key={principle.number} className="border-t-2 border-[#da6b43] pt-5">
                <p className="font-mono text-xs text-[#da6b43]">{principle.number}</p>
                <h3 className="mt-8 font-serif text-3xl text-[#173b35]">{principle.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#5a7068]">{principle.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-[#c7d2c8] bg-[#fbfcf8]">
          <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20">
            <div className="flex flex-col justify-between gap-5 border-b border-[#c7d2c8] pb-8 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#da6b43]">Managed by Anubhava</p>
                <h2 className="mt-3 font-serif text-5xl leading-none text-[#173b35]">The events we make.</h2>
              </div>
              <p className="max-w-xs text-sm leading-6 text-[#5a7068]">{events.length} gatherings, talks, workshops, and moments worth making time for.</p>
            </div>
            <div className="mt-8 divide-y divide-[#d8ded8]">
              {events.map((event, index) => (
                <Link href={`/events/${event.id}`} key={event.id} className="group grid gap-5 py-7 transition-colors hover:bg-[#f5f7f2] sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-8 sm:px-4">
                  <span className="font-mono text-xs text-[#da6b43]">0{index + 1}</span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#789087]">{event.category}</p>
                    <h3 className="mt-2 font-serif text-3xl leading-none text-[#173b35] group-hover:text-[#da6b43]">{event.title}</h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#5a7068]">{event.description}</p>
                  </div>
                  <div className="grid gap-2 text-sm text-[#5a7068] sm:justify-items-end">
                    <span className="inline-flex items-center gap-2"><CalendarDays aria-hidden="true" className="size-4 text-[#da6b43]" />{event.date}</span>
                    <span className="inline-flex items-center gap-2"><MapPin aria-hidden="true" className="size-4 text-[#da6b43]" />{event.location}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
