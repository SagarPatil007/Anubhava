"use client";

import { ArrowLeft, ArrowUpRight, CalendarDays, Check, Clock3, MapPin } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { EventItem } from "@/lib/events";

type BookingFormProps = {
  event: EventItem;
};

const inputClassName =
  "mt-2 h-12 rounded-none border-[#c7d2c8] bg-[#fbfcf8] text-sm text-[#173b35] placeholder:text-[#8a9a91] focus-visible:border-[#da6b43] focus-visible:ring-[#da6b43]/20";

export function BookingForm({ event }: BookingFormProps) {
  const [isBooked, setIsBooked] = useState(false);

  const handleSubmit = (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    setIsBooked(true);
  };

  if (isBooked) {
    return (
      <section className="border border-[#c7d2c8] bg-[#fbfcf8] px-6 py-16 text-center sm:px-12">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#dbe8d9] text-[#173b35]"><Check aria-hidden="true" className="size-7" /></span>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#da6b43]">You&apos;re booked</p>
        <h2 className="mt-3 font-serif text-5xl leading-none text-[#173b35]">See you at {event.title}.</h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#5a7068]">Your reservation request has been recorded. A confirmation with the event details will be sent to your email.</p>
        <Link href={`/events/${event.id}`} className="mt-8 inline-flex h-12 items-center justify-center gap-2 bg-[#173b35] px-5 text-sm font-medium text-[#f5f7f2] hover:bg-[#28584e]">Back to event <ArrowUpRight aria-hidden="true" className="size-4" /></Link>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-[#c7d2c8] bg-[#fbfcf8] p-6 sm:p-10">
      <div className="border-b border-[#d8ded8] pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#da6b43]">Your reservation</p>
        <h2 className="mt-3 font-serif text-4xl leading-none text-[#173b35]">Save your place.</h2>
        <div className="mt-6 grid gap-3 text-sm text-[#5a7068] sm:grid-cols-3">
          <span className="inline-flex items-center gap-2"><CalendarDays aria-hidden="true" className="size-4 text-[#da6b43]" />{event.date}</span>
          <span className="inline-flex items-center gap-2"><Clock3 aria-hidden="true" className="size-4 text-[#da6b43]" />{event.time}</span>
          <span className="inline-flex items-center gap-2"><MapPin aria-hidden="true" className="size-4 text-[#da6b43]" />{event.location}</span>
        </div>
      </div>

      <div className="mt-7 grid gap-6 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-[#173b35]">
          Full name <span className="text-[#da6b43]">*</span>
          <Input required name="name" autoComplete="name" placeholder="Your name" className={inputClassName} />
        </label>
        <label className="block text-sm font-semibold text-[#173b35]">
          Email address <span className="text-[#da6b43]">*</span>
          <Input required name="email" type="email" autoComplete="email" placeholder="you@example.com" className={inputClassName} />
        </label>
        <label className="block text-sm font-semibold text-[#173b35]">
          Phone number
          <Input name="phone" type="tel" autoComplete="tel" placeholder="Optional" className={inputClassName} />
        </label>
        <label className="block text-sm font-semibold text-[#173b35]">
          Number of places <span className="text-[#da6b43]">*</span>
          <select required name="quantity" defaultValue="1" className={inputClassName}>
            <option value="1">1 place</option>
            <option value="2">2 places</option>
            <option value="3">3 places</option>
            <option value="4">4 places</option>
          </select>
        </label>
        <label className="block text-sm font-semibold text-[#173b35] sm:col-span-2">
          Note for the hosts
          <textarea name="note" placeholder="Anything you would like us to know?" className="mt-2 min-h-28 w-full resize-y border border-[#c7d2c8] bg-[#fbfcf8] px-3 py-3 text-sm leading-6 text-[#173b35] outline-none placeholder:text-[#8a9a91] focus:border-[#da6b43] focus:ring-3 focus:ring-[#da6b43]/20" />
        </label>
      </div>

      <div className="mt-8 flex flex-col-reverse justify-between gap-4 border-t border-[#d8ded8] pt-6 sm:flex-row sm:items-center">
        <Link href={`/events/${event.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#5a7068] hover:text-[#173b35]"><ArrowLeft aria-hidden="true" className="size-4" /> Back to event</Link>
        <Button type="submit" className="h-12 gap-2 bg-[#173b35] px-6 text-[#f5f7f2] hover:bg-[#28584e]">Confirm reservation <ArrowUpRight aria-hidden="true" className="size-4" /></Button>
      </div>
    </form>
  );
}
