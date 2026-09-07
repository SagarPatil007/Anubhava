import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BookingForm } from "@/components/booking-form";
import { getEvent } from "@/lib/events";

type BookingPageProps = {
  params: Promise<{ id: string }>;
};

export default async function BookingPage({ params }: BookingPageProps) {
  const { id } = await params;
  const event = getEvent(id);

  if (!event) notFound();

  return (
    <div className="min-h-full bg-[#f5f7f2] text-[#173b35]">
      <header className="border-b border-[#d8ded8] bg-[#fbfcf8]">
        <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-6 px-6 lg:px-10">
          <Link href="/" className="flex shrink-0 items-center gap-3 text-[#173b35]" aria-label="Anubhava home">
            <span className="grid size-9 place-items-center rounded-full bg-[#173b35] text-lg font-semibold text-[#f5f7f2]">A</span>
            <span className="font-serif text-[1.45rem] tracking-[-0.02em]">Anubhava</span>
          </Link>
          <Link href={`/events/${event.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#5a7068] hover:text-[#173b35]"><ArrowLeft aria-hidden="true" className="size-4" /> Event details</Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#da6b43]">Reserve your place</p>
          <h1 className="mt-4 max-w-2xl font-serif text-6xl leading-[0.92] tracking-[-0.04em] text-[#173b35] sm:text-7xl">Join {event.title}.</h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#5a7068]">A few details are all we need. We&apos;ll keep your place and share everything you need before the event begins.</p>
          <div className="mt-10">
            <BookingForm event={event} />
          </div>
          <Link href={`/events/${event.id}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#5a7068] hover:text-[#173b35]">Read event details <ArrowUpRight aria-hidden="true" className="size-4" /></Link>
        </div>
      </main>
    </div>
  );
}
