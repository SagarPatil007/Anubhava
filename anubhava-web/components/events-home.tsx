"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useState } from "react";

import { Input } from "@/components/ui/input";
import { events } from "@/lib/events";

const categories = ["All events", "Community", "Talks", "Wellbeing", "Workshop", "Gathering"];

export function EventsHome() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All events");
  const deferredQuery = useDeferredValue(query);
  const filteredEvents = events.filter((event) => {
    const matchesCategory = category === "All events" || event.category === category;
    const searchableText = `${event.title} ${event.category} ${event.location}`.toLowerCase();
    return matchesCategory && searchableText.includes(deferredQuery.toLowerCase());
  });

  return (
    <>
      <header className="border-b border-[#d8ded8] bg-[#fbfcf8]">
        <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-6 px-6 lg:px-10">
          <Link href="/" className="flex shrink-0 items-center gap-3 text-[#173b35]" aria-label="Anubhava home">
            <span className="grid size-9 place-items-center rounded-full bg-[#173b35] text-lg font-semibold text-[#f5f7f2]">A</span>
            <span className="font-serif text-[1.45rem] tracking-[-0.02em]">Anubhava</span>
          </Link>
          <div className="hidden max-w-md flex-1 md:block">
            <label htmlFor="event-search" className="sr-only">Search events</label>
            <div className="relative">
              <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#789087]" />
              <Input id="event-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search events, places, or topics" className="h-10 rounded-none border-[#c7d2c8] bg-[#f5f7f2] pl-10 text-sm" />
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-[#45615a] sm:flex">
            <a href="#events" className="hover:text-[#173b35]">Discover</a>
            <Link href="/about" className="hover:text-[#173b35]">About</Link>
            <Link href="/events/create" className="inline-flex items-center gap-2 bg-[#da6b43] px-4 py-2.5 text-white transition-colors hover:bg-[#bd5835]">Host an event <span aria-hidden="true">↗</span></Link>
          </nav>
        </div>
        <div className="mx-auto block max-w-7xl px-6 pb-4 md:hidden">
          <label htmlFor="mobile-event-search" className="sr-only">Search events</label>
          <div className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#789087]" />
            <Input id="mobile-event-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search events" className="h-10 rounded-none border-[#c7d2c8] bg-[#f5f7f2] pl-10 text-sm" />
          </div>
          <Link href="/events/create" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#da6b43] hover:text-[#bd5835]">Host an event <span aria-hidden="true">↗</span></Link>
        </div>
      </header>

      <main id="events" className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20">
        <div className="flex flex-col justify-between gap-8 border-b border-[#c7d2c8] pb-10 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#da6b43]">The Anubhava calendar</p>
            <h1 className="mt-4 max-w-2xl font-serif text-6xl leading-[0.92] tracking-[-0.04em] text-[#173b35] sm:text-7xl">Find your next meaningful moment.</h1>
          </div>
          <p className="max-w-xs text-sm leading-6 text-[#5a7068]">Gatherings, workshops, and conversations for people who want to make more room for good work.</p>
        </div>

        <div className="flex gap-2 overflow-x-auto py-7" aria-label="Filter events by category">
          <SlidersHorizontal aria-hidden="true" className="mr-2 mt-2 size-4 shrink-0 text-[#da6b43]" />
          {categories.map((item) => (
            <button key={item} type="button" onClick={() => setCategory(item)} className={`shrink-0 border px-4 py-2 text-sm font-semibold transition-colors ${category === item ? "border-[#173b35] bg-[#173b35] text-[#f5f7f2]" : "border-[#c7d2c8] bg-transparent text-[#5a7068] hover:border-[#173b35] hover:text-[#173b35]"}`}>{item}</button>
          ))}
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <Link href={`/events/${event.id}`} key={event.id} className="group flex min-h-[390px] flex-col border border-[#d8ded8] bg-[#fbfcf8] transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(23,59,53,0.1)]">
                <div className={`relative h-48 overflow-hidden ${event.color}`}>
                  <Image src={event.thumbnail} alt={`${event.title} event thumbnail`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute left-4 top-4 bg-[#fbfcf8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#da6b43]">{event.category}</span>
                  <span className="absolute bottom-4 right-4 text-xs font-mono text-[#45615a]">{event.date}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="font-serif text-3xl leading-none text-[#173b35] group-hover:text-[#da6b43]">{event.title}</h2>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#5a7068]">{event.description}</p>
                  <p className="mt-auto pt-5 text-xs font-semibold uppercase tracking-[0.1em] text-[#789087]">{event.location}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-[#c7d2c8] px-6 py-20 text-center"><p className="font-serif text-3xl text-[#173b35]">No events found.</p><p className="mt-2 text-sm text-[#5a7068]">Try another search or category.</p></div>
        )}
      </main>
    </>
  );
}
