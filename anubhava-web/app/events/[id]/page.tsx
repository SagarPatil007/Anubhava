import { ArrowLeft, ArrowUpRight, CalendarDays, Clock3, MapPin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { EventGallery } from "@/components/event-gallery";
import { BackendEvent, mapBackendEvent } from "@/lib/events";

const gatewayUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

type EventPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  const response = await fetch(`${gatewayUrl}/api/v1/event/${encodeURIComponent(id)}`, { cache: "no-store" });
  const result = await response.json() as { success?: boolean; data?: BackendEvent };
  const event = result.success && result.data ? mapBackendEvent(result.data) : null;

  if (!event) notFound();

  return (
    <div className="min-h-full bg-[#f5f7f2] text-[#173b35]">
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#5a7068] hover:text-[#173b35]"><ArrowLeft aria-hidden="true" className="size-4" /> Back to events</Link>
        <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-20">
          <section aria-labelledby="event-gallery-title">
            <div className="flex items-end justify-between gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#da6b43]">A glimpse inside</p>
                <h2 id="event-gallery-title" className="mt-3 font-serif text-4xl leading-none text-[#173b35]">The atmosphere.</h2>
              </div>
              <span className="hidden text-sm text-[#789087] sm:block">{event.gallery.length} images</span>
            </div>
            <EventGallery title={event.title} images={event.gallery} />
          </section>
          <article>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#da6b43]">{event.category}</p>
            <h1 className="mt-4 font-serif text-6xl leading-[0.9] tracking-[-0.04em] text-[#173b35] sm:text-8xl">{event.title}</h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#5a7068]">{event.description}</p>
            <div className="mt-9 grid gap-4 border-y border-[#c7d2c8] py-6 sm:grid-cols-3">
              <div className="flex gap-3"><CalendarDays className="mt-0.5 size-5 shrink-0 text-[#da6b43]" aria-hidden="true" /><span className="text-sm font-semibold">{event.date}</span></div>
              <div className="flex gap-3"><Clock3 className="mt-0.5 size-5 shrink-0 text-[#da6b43]" aria-hidden="true" /><span className="text-sm font-semibold">{event.time}</span></div>
              <div className="flex gap-3"><MapPin className="mt-0.5 size-5 shrink-0 text-[#da6b43]" aria-hidden="true" /><span className="text-sm font-semibold">{event.location}</span></div>
            </div>
            <p className="mt-9 max-w-xl text-base leading-8 text-[#45615a]">{event.details}</p>
            <Link href={`/events/${event.id}/book`} className="mt-10 inline-flex items-center gap-2 bg-[#173b35] px-6 py-4 text-sm font-semibold text-[#f5f7f2] transition-colors hover:bg-[#28584e]">Reserve your place <ArrowUpRight aria-hidden="true" className="size-4" /></Link>
          </article>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
