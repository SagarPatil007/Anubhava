import Link from "next/link";
import { ArrowUpRight, CalendarDays, Sparkles } from "lucide-react";

import { CreateEventForm } from "@/components/create-event-form";

export default function CreateEventPage() {
  return (
    <div className="min-h-screen bg-[#eef3ed] text-[#173b35]">
      <header className="border-b border-[#d8ded8]/80 bg-[#f8faf6]/90">
        <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-6 px-6 lg:px-10">
          <Link href="/" className="flex shrink-0 items-center gap-3 text-[#173b35]" aria-label="Anubhava home">
            <span className="grid size-9 place-items-center rounded-full bg-[#173b35] text-lg font-semibold text-[#f5f7f2]">A</span>
            <span className="font-serif text-[1.45rem] tracking-[-0.02em]">Anubhava</span>
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#5a7068] transition-colors hover:text-[#173b35]">
            Browse events <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.5fr] lg:items-start">
          <aside className="overflow-hidden bg-[#173b35] p-7 text-[#f5f7f2] sm:p-9 lg:sticky lg:top-8">
            <div className="flex size-12 items-center justify-center rounded-full bg-[#da6b43]">
              <CalendarDays aria-hidden="true" className="size-5" />
            </div>
            <p className="mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-[#f2aa8d]">Bring people together</p>
            <h1 className="mt-4 font-serif text-5xl leading-[0.94] tracking-[-0.03em] sm:text-6xl">Create a gathering people remember.</h1>
            <p className="mt-6 text-sm leading-6 text-[#c4d2c9]">Share the essentials, set the mood, and make it easy for the right people to join you.</p>
            <div className="mt-10 border-t border-[#789087]/40 pt-6">
              <div className="flex items-start gap-3">
                <Sparkles aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#f2aa8d]" />
                <p className="text-sm leading-6 text-[#d7e2da]">A clear title, useful details, and a strong cover image help your event stand out.</p>
              </div>
            </div>
          </aside>
          <section className="min-w-0">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#da6b43]">Event details</p>
                <h2 className="mt-2 font-serif text-3xl leading-none text-[#173b35] sm:text-4xl">Start with the essentials.</h2>
              </div>
              <span className="hidden text-right text-xs leading-5 text-[#789087] sm:block">Takes about<br />2 minutes</span>
            </div>
            <CreateEventForm />
          </section>
        </div>
      </main>
    </div>
  );
}
