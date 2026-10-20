import { ArrowLeft, CalendarDays } from "lucide-react";
import Link from "next/link";

export default function YourEventsPage() {
  return (
    <div className="min-h-screen bg-[#f8faf6] text-[#173b35]">
      <header className="border-b border-[#d8ded8] bg-[#fbfcf8]"><div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between px-6 lg:px-10"><Link href="/" className="font-serif text-[1.45rem]">Anubhava</Link><Link href="/profile" className="inline-flex items-center gap-2 text-sm font-semibold text-[#5a7068] hover:text-[#173b35]"><ArrowLeft className="size-4" /> Profile</Link></div></header>
      <main className="mx-auto max-w-5xl px-6 py-12 lg:px-10 lg:py-20"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#da6b43]">Created by you</p><h1 className="mt-3 font-serif text-5xl">Your events</h1><div className="mt-10 border border-dashed border-[#c7d2c8] bg-[#fbfcf8] px-6 py-20 text-center"><CalendarDays className="mx-auto size-10 text-[#da6b43]" /><h2 className="mt-5 font-serif text-3xl">No events yet</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#5a7068]">Events you create will appear here so you can manage and share them with your community.</p><Link href="/events/create" className="mt-7 inline-flex bg-[#173b35] px-5 py-3 text-sm font-semibold text-white hover:bg-[#28584e]">Create an event</Link></div></main>
    </div>
  );
}