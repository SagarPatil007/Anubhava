"use client";

import { ArrowLeft, CalendarDays, Check, Mail, Phone, Save, Ticket, UserRound, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BackendEvent, EventItem, mapBackendEvent } from "@/lib/events";

type UserProfile = {
  userId?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address?: { addressLine?: string; city?: string; state?: string; country?: string; zipCode?: string };
};

type Preferences = {
  addressLine?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  hobbies?: string;
  preferredHobbies?: string;
  maritalStatus?: string;
  alcoholPreference?: string;
  foodPreference?: string;
};

type ApiResponse<T> = { success: boolean; data?: T; message?: string };
const gatewayUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

type EditingSection = "account" | "preferences" | null;
type ProfileView = "profile" | "events" | "bookings";
type Booking = { bookingId?: number; eventId: number; name: string; email: string; quantity: number; status?: string; createdAt?: string };
const profileNamePattern = /^[\p{L}][\p{L} .'-]{1,79}$/u;
const profilePhonePattern = /^(?=(?:\D*\d){7,15}\D*$)\+?[0-9() .-]+$/;
const preferenceMaxLengths: Record<keyof Preferences, number> = {
  addressLine: 255,
  city: 100,
  state: 100,
  country: 100,
  zipCode: 12,
  hobbies: 512,
  preferredHobbies: 512,
  maritalStatus: 30,
  alcoholPreference: 30,
  foodPreference: 30,
};

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-[#e1e7e1] py-5 last:border-b-0">
      <div><p className="text-sm font-semibold text-[#173b35]">{label}</p><p className="mt-1 text-sm text-[#789087]">{value || "Not added yet"}</p></div>
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<EditingSection>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [accountForm, setAccountForm] = useState({ firstName: "", lastName: "", phoneNumber: "" });
  const [preferenceForm, setPreferenceForm] = useState<Preferences>({});
  const [activeView, setActiveView] = useState<ProfileView>("profile");
  const [createdEvents, setCreatedEvents] = useState<EventItem[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  useEffect(() => {
    const email = window.localStorage.getItem("anubhava_user_email");
    const loadProfile = async () => {
      if (!email) {
        setError("Please log in to view your profile.");
        return;
      }
      try {
        const [profileResponse, preferenceResponse] = await Promise.all([
          fetch(`${gatewayUrl}/api/v1/users/email?email=${encodeURIComponent(email)}`),
          fetch(`${gatewayUrl}/api/v1/users/preferences?email=${encodeURIComponent(email)}`),
        ]);
        const profileResult = await profileResponse.json() as ApiResponse<UserProfile>;
        const preferenceResult = await preferenceResponse.json() as ApiResponse<Preferences>;
        if (!profileResponse.ok || !profileResult.success || !profileResult.data) throw new Error(profileResult.message ?? "Unable to load your profile.");
        setProfile(profileResult.data);
        setAccountForm({ firstName: profileResult.data.firstName ?? "", lastName: profileResult.data.lastName ?? "", phoneNumber: profileResult.data.phoneNumber ?? "" });
        if (preferenceResult.success) setPreferences(preferenceResult.data ?? null);
        if (preferenceResult.success && preferenceResult.data) setPreferenceForm(preferenceResult.data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load your profile.");
      }
    };
    void loadProfile();
  }, []);

  const displayName = profile ? `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim() : "Your profile";
  const initials = displayName === "Your profile" ? "U" : displayName.slice(0, 2).toUpperCase();
  const address = preferences?.addressLine || [profile?.address?.addressLine, profile?.address?.city, profile?.address?.state, profile?.address?.country].filter(Boolean).join(", ");

  const beginAccountEdit = () => {
    if (!profile) return;
    setSaveMessage(null);
    setAccountForm({ firstName: profile.firstName ?? "", lastName: profile.lastName ?? "", phoneNumber: profile.phoneNumber ?? "" });
    setEditingSection("account");
  };

  const beginPreferenceEdit = () => {
    setSaveMessage(null);
    setPreferenceForm(preferences ?? {});
    setEditingSection("preferences");
  };

  const saveAccount = async () => {
    if (!profile?.userId) return;
    if (!profileNamePattern.test(accountForm.firstName.trim()) || !profileNamePattern.test(accountForm.lastName.trim())) {
      setSaveMessage("Enter valid first and last names (2–80 letters, spaces, apostrophes, periods, or hyphens).");
      return;
    }
    if (!profilePhonePattern.test(accountForm.phoneNumber.trim())) {
      setSaveMessage("Enter a valid phone number with 7 to 15 digits.");
      return;
    }
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const response = await fetch(`${gatewayUrl}/api/v1/users/${profile.userId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...profile, ...accountForm }) });
      const result = await response.json() as ApiResponse<UserProfile>;
      if (!response.ok || !result.success || !result.data) throw new Error(result.message ?? "Unable to update your profile.");
      setProfile(result.data);
      setEditingSection(null);
      setSaveMessage("Profile details updated successfully.");
    } catch (saveError) {
      setSaveMessage(saveError instanceof Error ? saveError.message : "Unable to update your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const savePreferences = async () => {
    const email = profile?.email ?? window.localStorage.getItem("anubhava_user_email");
    if (!email) return;
    if (Object.entries(preferenceMaxLengths).some(([field, max]) => String(preferenceForm[field as keyof Preferences] ?? "").length > max)) {
      setSaveMessage("One or more preference fields exceed their maximum length.");
      return;
    }
    const postalCode = preferenceForm.zipCode ?? "";
    if (postalCode && !/^[A-Za-z0-9 -]{3,12}$/.test(postalCode)) {
      setSaveMessage("Enter a valid postal code using 3–12 letters, numbers, spaces, or hyphens.");
      return;
    }
    if (
      (preferenceForm.maritalStatus && !["Married", "Single", "Prefer not to say"].includes(preferenceForm.maritalStatus))
      || (preferenceForm.alcoholPreference && !["Alcoholic", "Non-alcoholic"].includes(preferenceForm.alcoholPreference))
      || (preferenceForm.foodPreference && !["Veg", "Non-veg"].includes(preferenceForm.foodPreference))
    ) {
      setSaveMessage("Choose valid values for your preferences.");
      return;
    }
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const response = await fetch(`${gatewayUrl}/api/v1/users/preferences`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...preferenceForm, email }) });
      const result = await response.json() as ApiResponse<Preferences>;
      if (!response.ok || !result.success) throw new Error(result.message ?? "Unable to update your preferences.");
      setPreferences(result.data ?? preferenceForm);
      setEditingSection(null);
      setSaveMessage("Matching preferences updated successfully.");
    } catch (saveError) {
      setSaveMessage(saveError instanceof Error ? saveError.message : "Unable to update your preferences.");
    } finally {
      setIsSaving(false);
    }
  };

  const updatePreference = (field: keyof Preferences, value: string) => setPreferenceForm((current) => ({ ...current, [field]: value }));

  const loadBookings = async () => {
    const email = profile?.email ?? window.localStorage.getItem("anubhava_user_email");
    if (!email) return;
    setBookingsLoading(true);
    setBookingsError(null);
    try {
      const response = await fetch(`${gatewayUrl}/api/v1/booking?email=${encodeURIComponent(email)}`);
      const result = await response.json() as ApiResponse<Booking[]>;
      if (!response.ok || !result.success) throw new Error(result.message ?? "Unable to load your bookings.");
      setBookings(result.data ?? []);
    } catch (loadError) {
      setBookingsError(loadError instanceof Error ? loadError.message : "Unable to load your bookings.");
    } finally {
      setBookingsLoading(false);
    }
  };

  const loadCreatedEvents = async () => {
    if (!profile?.userId) return;
    setEventsLoading(true);
    setEventsError(null);
    try {
      const response = await fetch(`${gatewayUrl}/api/v1/event?organizerId=${profile.userId}`);
      const result = await response.json() as ApiResponse<BackendEvent[]>;
      if (!response.ok || !result.success) throw new Error(result.message ?? "Unable to load your events.");
      setCreatedEvents((result.data ?? []).map(mapBackendEvent));
    } catch (loadError) {
      setEventsError(loadError instanceof Error ? loadError.message : "Unable to load your events.");
    } finally {
      setEventsLoading(false);
    }
  };

  const bookingsSection = (
    <section className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#da6b43]">Reserved by you</p>
      <h2 className="mt-3 font-serif text-5xl leading-none">Your bookings</h2>
      {bookingsLoading ? (
        <div className="mt-8 border border-dashed border-[#c7d2c8] bg-[#fbfcf8] px-6 py-20 text-center text-sm text-[#5a7068]">Loading your bookings...</div>
      ) : bookingsError ? (
        <div className="mt-8 border border-dashed border-[#c7d2c8] bg-[#fbfcf8] px-6 py-20 text-center text-sm text-[#b84d32]">{bookingsError}</div>
      ) : bookings.length === 0 ? (
        <div className="mt-8 border border-dashed border-[#c7d2c8] bg-[#fbfcf8] px-6 py-20 text-center">
          <Ticket className="mx-auto size-10 text-[#da6b43]" />
          <h3 className="mt-5 font-serif text-3xl">No bookings yet</h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#5a7068]">Events you book will appear here with their dates, locations, and reservation details.</p>
          <Link href="/#events" className="mt-7 inline-flex bg-[#173b35] px-5 py-3 text-sm font-semibold text-white hover:bg-[#28584e]">Discover events</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          {bookings.map((booking) => (
            <Link
              key={booking.bookingId ?? `${booking.eventId}-${booking.createdAt}`}
              href={`/events/${booking.eventId}`}
              className="flex items-center justify-between gap-5 border border-[#d8ded8] bg-[#fbfcf8] p-5 transition-colors hover:border-[#da6b43]"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#da6b43]">Booking {booking.bookingId ? `#${booking.bookingId}` : ""}</p>
                <h3 className="mt-2 font-serif text-3xl">Event #{booking.eventId}</h3>
                <p className="mt-2 text-sm text-[#5a7068]">
                  {booking.quantity} {booking.quantity === 1 ? "place" : "places"}
                  {booking.status ? ` · ${booking.status}` : ""}
                  {booking.createdAt ? ` · Booked ${new Date(booking.createdAt).toLocaleDateString()}` : ""}
                </p>
              </div>
              <Ticket aria-hidden="true" className="size-5 shrink-0 text-[#da6b43]" />
            </Link>
          ))}
        </div>
      )}
    </section>
  );

  return (
    <div className="min-h-screen bg-[#f8faf6] text-[#173b35]">
      <header className="border-b border-[#d8ded8] bg-[#fbfcf8]"><div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between px-6 lg:px-10"><Link href="/" className="flex items-center gap-3 font-serif text-[1.45rem]"><span className="grid size-9 place-items-center rounded-full bg-[#173b35] text-lg font-semibold text-[#f5f7f2]">A</span>Anubhava</Link><Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#5a7068] hover:text-[#173b35]"><ArrowLeft className="size-4" /> Back to events</Link></div></header>
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-16">
        {error ? <div className="border border-[#d8ded8] bg-[#fbfcf8] p-10 text-center"><UserRound className="mx-auto size-10 text-[#da6b43]" /><h1 className="mt-5 font-serif text-4xl">Profile unavailable</h1><p className="mt-3 text-sm text-[#5a7068]">{error}</p><Link href="/" className="mt-7 inline-flex bg-[#173b35] px-5 py-3 text-sm font-semibold text-white">Back to events</Link></div> : (
          <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
            <aside><div className="grid size-24 place-items-center rounded-full bg-[#173b35] text-2xl font-bold text-[#f5f7f2]">{initials}</div><h1 className="mt-5 font-serif text-3xl">{displayName}</h1><p className="mt-2 text-sm text-[#789087]">Anubhava member</p><div className="mt-8 space-y-3 text-sm text-[#5a7068]"><p className="flex items-center gap-2"><Mail className="size-4 text-[#da6b43]" />{profile?.email}</p><p className="flex items-center gap-2"><Phone className="size-4 text-[#da6b43]" />{profile?.phoneNumber || "No phone added"}</p></div><nav className="mt-10 space-y-2" aria-label="Profile sections"><button type="button" onClick={() => setActiveView("profile")} className={`flex w-full items-center gap-3 border px-4 py-3 text-left text-sm font-semibold transition-colors ${activeView === "profile" ? "border-[#173b35] bg-[#173b35] text-white" : "border-[#d8ded8] bg-[#fbfcf8] hover:border-[#da6b43] hover:text-[#da6b43]"}`}><UserRound className="size-4" />Profile details</button><button type="button" onClick={() => { setActiveView("events"); setEditingSection(null); void loadCreatedEvents(); }} className={`flex w-full items-center gap-3 border px-4 py-3 text-left text-sm font-semibold transition-colors ${activeView === "events" ? "border-[#173b35] bg-[#173b35] text-white" : "border-[#d8ded8] bg-[#fbfcf8] hover:border-[#da6b43] hover:text-[#da6b43]"}`}><CalendarDays className="size-4" />Your events</button><button type="button" onClick={() => { setActiveView("bookings"); setEditingSection(null); void loadBookings(); }} className={`flex w-full items-center gap-3 border px-4 py-3 text-left text-sm font-semibold transition-colors ${activeView === "bookings" ? "border-[#173b35] bg-[#173b35] text-white" : "border-[#d8ded8] bg-[#fbfcf8] hover:border-[#da6b43] hover:text-[#da6b43]"}`}><Ticket className="size-4" />Your bookings</button></nav></aside>
            {activeView === "profile" ? <section className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#da6b43]">Your account</p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-4"><h2 className="font-serif text-5xl leading-none">Profile details</h2><Button type="button" onClick={beginAccountEdit} className="gap-2 bg-[#da6b43] text-white hover:bg-[#bd5835]">Edit profile</Button></div>
              {saveMessage && <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#28584e]"><Check className="size-4" />{saveMessage}</p>}
              {editingSection === "account" ? (
                <div className="mt-8 border-t border-[#d8ded8] bg-[#fbfcf8] p-5 sm:p-8">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="text-sm font-semibold">First name<Input required minLength={2} maxLength={80} pattern="[\p{L}][\p{L} .'-]{1,79}" value={accountForm.firstName} onChange={(event) => setAccountForm({ ...accountForm, firstName: event.target.value })} className="mt-2" /></label>
                    <label className="text-sm font-semibold">Last name<Input required minLength={2} maxLength={80} pattern="[\p{L}][\p{L} .'-]{1,79}" value={accountForm.lastName} onChange={(event) => setAccountForm({ ...accountForm, lastName: event.target.value })} className="mt-2" /></label>
                    <label className="text-sm font-semibold">Phone number<Input required type="tel" maxLength={24} value={accountForm.phoneNumber} onChange={(event) => setAccountForm({ ...accountForm, phoneNumber: event.target.value })} className="mt-2 sm:col-span-2" /></label>
                  </div>
                  <div className="mt-6 flex justify-end gap-3"><Button type="button" variant="ghost" onClick={() => setEditingSection(null)}><X className="size-4" />Cancel</Button><Button type="button" disabled={isSaving} onClick={() => void saveAccount()} className="gap-2 bg-[#173b35] text-white">{isSaving ? "Saving..." : "Save changes"}<Save className="size-4" /></Button></div>
                </div>
              ) : (
                <div className="mt-8 border-t border-[#d8ded8] bg-[#fbfcf8] px-5 sm:px-8"><DetailRow label="Full name" value={displayName} /><DetailRow label="Email address" value={profile?.email} /><DetailRow label="Phone number" value={profile?.phoneNumber} /><DetailRow label="Location" value={address} /></div>
              )}
              <div className="mt-10"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#da6b43]">Matching preferences</p><div className="mt-3 flex flex-wrap items-center justify-between gap-4"><h3 className="font-serif text-3xl">What fits you best</h3><Button type="button" variant="outline" onClick={beginPreferenceEdit} className="gap-2 border-[#da6b43] text-[#da6b43] hover:bg-[#da6b43] hover:text-white">Edit preferences</Button></div>
                {editingSection === "preferences" ? (
                  <div className="mt-5 border-t border-[#d8ded8] bg-[#fbfcf8] p-5 sm:p-8"><div className="grid gap-5 sm:grid-cols-2">
                    {(["addressLine", "city", "state", "country", "zipCode"] as const).map((field) => <label key={field} className="text-sm font-semibold">{field === "zipCode" ? "Pincode" : field.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase())}<Input maxLength={preferenceMaxLengths[field]} pattern={field === "zipCode" ? "[A-Za-z0-9 -]{3,12}" : undefined} value={preferenceForm[field] ?? ""} onChange={(event) => updatePreference(field, event.target.value)} className="mt-2" /></label>)}
                    {(["hobbies", "preferredHobbies", "maritalStatus", "alcoholPreference", "foodPreference"] as const).map((field) => <label key={field} className="text-sm font-semibold">{field.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase())}<Input maxLength={preferenceMaxLengths[field]} value={preferenceForm[field] ?? ""} onChange={(event) => updatePreference(field, event.target.value)} className="mt-2" /></label>)}
                  </div><div className="mt-6 flex justify-end gap-3"><Button type="button" variant="ghost" onClick={() => setEditingSection(null)}><X className="size-4" />Cancel</Button><Button type="button" disabled={isSaving} onClick={() => void savePreferences()} className="gap-2 bg-[#173b35] text-white">{isSaving ? "Saving..." : "Save changes"}<Save className="size-4" /></Button></div></div>
                ) : (
                  <div className="mt-5 border-t border-[#d8ded8] bg-[#fbfcf8] px-5 sm:px-8"><DetailRow label="Hobbies" value={preferences?.hobbies?.replaceAll(",", ", ")} /><DetailRow label="Preferred hobbies" value={preferences?.preferredHobbies?.replaceAll(",", ", ")} /><DetailRow label="Marital status" value={preferences?.maritalStatus} /><DetailRow label="Alcohol preference" value={preferences?.alcoholPreference} /><DetailRow label="Food preference" value={preferences?.foodPreference} /></div>
                )}
              </div>
            </section> : activeView === "events" ? <section className="max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#da6b43]">Created by you</p><div className="mt-3 flex flex-wrap items-center justify-between gap-4"><h2 className="font-serif text-5xl leading-none">Your events</h2><Link href="/events/create" className="inline-flex bg-[#da6b43] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#bd5835]">Create an event</Link></div>{eventsLoading ? <div className="mt-8 border border-dashed border-[#c7d2c8] bg-[#fbfcf8] px-6 py-20 text-center text-sm text-[#5a7068]">Loading your events...</div> : eventsError ? <div className="mt-8 border border-dashed border-[#c7d2c8] bg-[#fbfcf8] px-6 py-20 text-center text-sm text-[#b84d32]">{eventsError}</div> : createdEvents.length === 0 ? <div className="mt-8 border border-dashed border-[#c7d2c8] bg-[#fbfcf8] px-6 py-20 text-center"><CalendarDays className="mx-auto size-10 text-[#da6b43]" /><h3 className="mt-5 font-serif text-3xl">No events yet</h3><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#5a7068]">Events you create will appear here so you can manage and share them with your community.</p></div> : <div className="mt-8 grid gap-4">{createdEvents.map((event) => <Link key={event.id} href={`/events/${event.id}`} className="flex items-center justify-between gap-5 border border-[#d8ded8] bg-[#fbfcf8] p-5 transition-colors hover:border-[#da6b43]"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#da6b43]">{event.category}</p><h3 className="mt-2 font-serif text-3xl">{event.title}</h3><p className="mt-2 text-sm text-[#5a7068]">{event.date} · {event.location}</p></div><CalendarDays className="size-5 shrink-0 text-[#da6b43]" /></Link>)}</div>}</section> : bookingsSection}
          </div>
        )}
      </main>
    </div>
  );
}