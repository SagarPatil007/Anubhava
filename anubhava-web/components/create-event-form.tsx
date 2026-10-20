"use client";

import { ArrowLeft, ArrowUpRight, Check, ImagePlus, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const inputClassName =
  "mt-2 h-12 rounded-none border-[#c7d2c8] bg-[#fbfcf8] text-sm text-[#173b35] placeholder:text-[#8a9a91] focus-visible:border-[#da6b43] focus-visible:ring-[#da6b43]/20";
const textareaClassName =
  "mt-2 min-h-32 w-full resize-y border border-[#c7d2c8] bg-[#fbfcf8] px-3 py-3 text-sm leading-6 text-[#173b35] outline-none placeholder:text-[#8a9a91] focus:border-[#da6b43] focus:ring-3 focus:ring-[#da6b43]/20";

const eventSchema = z.object({
  title: z.string().trim().min(3, "Event name must be at least 3 characters.").max(120, "Event name cannot exceed 120 characters."),
  category: z.enum(["", "Community", "Talks", "Wellbeing", "Workshop", "Gathering"]).refine((value) => value !== "", "Choose a valid category."),
  location: z.string().trim().min(1, "Location is required.").max(255, "Location cannot exceed 255 characters."),
  city: z.string().trim().min(1, "City is required.").max(100, "City cannot exceed 100 characters."),
  capacity: z.coerce.number().int().positive("Capacity must be greater than zero.").max(100000, "Capacity cannot exceed 100,000."),
  paid: z.enum(["free", "paid"]),
  price: z.coerce.number().finite("Enter a valid price.").min(0, "Price cannot be negative.").max(99999999.99, "Price cannot exceed 99,999,999.99.").refine((value) => Number.isInteger(value * 100), "Price can have at most 2 decimal places."),
  date: z.string().min(1, "Choose a date.").refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid date."),
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Enter a valid start time."),
  endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Enter a valid end time."),
  description: z.string().trim().min(1, "Short description is required.").max(1000, "Short description cannot exceed 1,000 characters."),
  details: z.string().max(3000, "More details cannot exceed 3,000 characters."),
}).superRefine((values, context) => {
  if (values.startTime && values.endTime && values.endTime <= values.startTime) {
    context.addIssue({ code: "custom", path: ["endTime"], message: "End time must be after start time." });
  }
  if (values.paid === "paid" && values.price <= 0) {
    context.addIssue({ code: "custom", path: ["price"], message: "Paid events must have a price greater than zero." });
  }
  if (values.description.length + (values.details ? values.details.length + 2 : 0) > 4000) {
    context.addIssue({ code: "custom", path: ["details"], message: "Combined event description cannot exceed 4,000 characters." });
  }
});

type EventFormInput = z.input<typeof eventSchema>;
type EventFormValues = z.output<typeof eventSchema>;
const gatewayUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export function CreateEventForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mediaUrls = useRef(new Set<string>());
  const form = useForm<EventFormInput, unknown, EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      category: "",
      location: "",
      city: "",
      capacity: 1,
      paid: "free",
      price: 0,
      date: "",
      startTime: "",
      endTime: "",
      description: "",
      details: "",
    },
  });
  const paidValue = useWatch({ control: form.control, name: "paid" });

  useEffect(() => {
    const urls = mediaUrls.current;
    return () => {
      urls.forEach((image) => URL.revokeObjectURL(image));
    };
  }, []);

  const readFileAsDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error(`Unable to read ${file.name}.`));
    reader.readAsDataURL(file);
  });

  const handleThumbnailChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      setThumbnailError("Choose an image that is 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    if (thumbnail) {
      if (thumbnail.startsWith("blob:")) URL.revokeObjectURL(thumbnail);
      mediaUrls.current.delete(thumbnail);
    }
    try {
      setThumbnail(await readFileAsDataUrl(file));
    } catch (error) {
      setThumbnailError(error instanceof Error ? error.message : "Unable to read the thumbnail.");
    }
  };

  const handleGalleryChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (selectedFiles.length > 6 - gallery.length) {
      setSubmitError("You can add up to 6 gallery images.");
      event.target.value = "";
      return;
    }
    if (selectedFiles.some((file) => !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024)) {
      setSubmitError("Each gallery image must be an image that is 5 MB or smaller.");
      event.target.value = "";
      return;
    }
    const files = selectedFiles;
    try {
      const dataUrls = await Promise.all(files.map(readFileAsDataUrl));
      setGallery((current) => [...current, ...dataUrls]);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to read gallery images.");
    }
  };

  const removeGalleryImage = (image: string) => {
    if (image.startsWith("blob:")) URL.revokeObjectURL(image);
    mediaUrls.current.delete(image);
    setGallery((current) => current.filter((item) => item !== image));
  };

  const handleSubmit = async (values: EventFormValues) => {
    if (!thumbnail) {
      setThumbnailError("A cover image is required.");
      return;
    }
    setThumbnailError(null);
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const email = window.localStorage.getItem("anubhava_user_email");
      if (!email) throw new Error("Please log in before creating an event.");

      const userResponse = await fetch(`${gatewayUrl}/api/v1/users/email?email=${encodeURIComponent(email)}`);
      const userResult = await userResponse.json() as { success?: boolean; data?: { userId?: number }; message?: string };
      if (!userResponse.ok || !userResult.success || !userResult.data?.userId) {
        throw new Error(userResult.message ?? "Unable to identify the event organizer.");
      }

      const response = await fetch(`${gatewayUrl}/api/v1/event/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName: values.title,
          eventType: values.category,
          startDate: values.date,
          endDate: values.date,
          startTime: values.startTime,
          endTime: values.endTime,
          venue: values.location,
          city: values.city,
          capacity: values.capacity,
          paid: values.paid === "paid",
          price: values.paid === "paid" ? values.price : 0,
          description: [values.description, values.details].filter(Boolean).join("\n\n"),
          thumbnailUrl: thumbnail,
          imageUrls: gallery,
          organizerId: userResult.data.userId,
          status: "PUBLISHED",
        }),
      });
      const result = await response.json() as { success?: boolean; message?: string; errors?: Array<{ message?: string }> };
      if (!response.ok || !result.success) throw new Error(result.errors?.find((item) => item.message)?.message ?? result.message ?? "Unable to create event.");
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to create event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="border border-[#c7d2c8] bg-[#fbfcf8] px-6 py-20 text-center sm:px-12">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#dbe8d9] text-[#173b35]">
          <Check aria-hidden="true" className="size-7" />
        </span>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#da6b43]">Event submitted</p>
        <h2 className="mt-3 font-serif text-5xl leading-none text-[#173b35]">Your gathering has a place to begin.</h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#5a7068]">
          This demo has captured the event details. Connect this form to your events API to publish it for your community.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="inline-flex h-12 items-center justify-center gap-2 bg-[#173b35] px-5 text-sm font-medium text-[#f5f7f2] hover:bg-[#28584e]">Back to events <ArrowUpRight aria-hidden="true" className="size-4" /></Link>
          <Button type="button" variant="outline" onClick={() => setIsSubmitted(false)} className="h-12 rounded-none border-[#c7d2c8] px-5 text-[#173b35]">
            Create another event
          </Button>
        </div>
      </section>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="border border-[#c7d2c8] bg-[#fbfcf8] p-6 sm:p-10">
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem className="sm:col-span-2"><FormLabel>Event name <span className="text-[#da6b43]">*</span></FormLabel><FormControl><Input placeholder="e.g. The Makers Table" className={inputClassName} {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="category" render={({ field }) => (
          <FormItem><FormLabel>Category <span className="text-[#da6b43]">*</span></FormLabel><FormControl><select className={inputClassName} {...field}><option value="" disabled>Choose a category</option><option>Community</option><option>Talks</option><option>Wellbeing</option><option>Workshop</option><option>Gathering</option></select></FormControl><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="location" render={({ field }) => (
          <FormItem><FormLabel>Location <span className="text-[#da6b43]">*</span></FormLabel><FormControl><Input placeholder="Venue or online link" className={inputClassName} {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="city" render={({ field }) => (
          <FormItem><FormLabel>City <span className="text-[#da6b43]">*</span></FormLabel><FormControl><Input placeholder="Pune" className={inputClassName} {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="capacity" render={({ field }) => (
          <FormItem><FormLabel>Capacity <span className="text-[#da6b43]">*</span></FormLabel><FormControl><Input type="number" min="1" placeholder="50" className={inputClassName} value={field.value == null ? "" : String(field.value)} onChange={(event) => field.onChange(event.target.value)} onBlur={field.onBlur} name={field.name} ref={field.ref} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="paid" render={({ field }) => (
          <FormItem><FormLabel>Entry type <span className="text-[#da6b43]">*</span></FormLabel><FormControl><select className={inputClassName} {...field}><option value="free">Free</option><option value="paid">Paid</option></select></FormControl><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="price" render={({ field }) => (
          <FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" min="0" step="0.01" placeholder="0" disabled={paidValue !== "paid"} className={inputClassName} value={field.value == null ? "" : String(field.value)} onChange={(event) => field.onChange(event.target.value)} onBlur={field.onBlur} name={field.name} ref={field.ref} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="date" render={({ field }) => (
          <FormItem><FormLabel>Date <span className="text-[#da6b43]">*</span></FormLabel><FormControl><Input type="date" className={inputClassName} {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <div className="grid grid-cols-2 gap-3">
          <FormField control={form.control} name="startTime" render={({ field }) => (
            <FormItem><FormLabel>Starts <span className="text-[#da6b43]">*</span></FormLabel><FormControl><Input type="time" className={inputClassName} {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="endTime" render={({ field }) => (
            <FormItem><FormLabel>Ends <span className="text-[#da6b43]">*</span></FormLabel><FormControl><Input type="time" className={inputClassName} {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem className="sm:col-span-2"><FormLabel>Short description <span className="text-[#da6b43]">*</span></FormLabel><FormControl><textarea placeholder="What will people experience?" className={textareaClassName} {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="details" render={({ field }) => (
          <FormItem className="sm:col-span-2"><FormLabel>More details</FormLabel><FormControl><textarea placeholder="Share the rhythm of the event, who it is for, and what to bring." className={textareaClassName} {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <fieldset className="sm:col-span-2">
          <legend className="text-sm font-semibold text-[#173b35]">Event images</legend>
          <p className="mt-1 text-sm font-normal leading-6 text-[#789087]">Add a strong cover image and a few moments that show people what to expect.</p>
          <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5a7068]">Thumbnail <span className="text-[#da6b43]">*</span></p>
              <label className="group relative mt-2 flex aspect-[16/10] cursor-pointer items-center justify-center overflow-hidden border border-dashed border-[#b8c4b9] bg-[#f5f7f2] transition-colors hover:border-[#da6b43]">
                {thumbnail ? (
                  <Image src={thumbnail} alt="Selected event thumbnail preview" fill unoptimized className="object-cover" />
                ) : (
                  <span className="flex flex-col items-center gap-2 px-5 text-center text-sm text-[#5a7068]">
                    <ImagePlus aria-hidden="true" className="size-7 text-[#da6b43]" />
                    <span className="font-semibold text-[#173b35]">Choose thumbnail</span>
                    <span className="text-xs">JPG, PNG, or WebP</span>
                  </span>
                )}
                <input type="file" name="thumbnail" accept="image/png,image/jpeg,image/webp" onChange={(event) => { setThumbnailError(null); handleThumbnailChange(event); }} className="sr-only" />
              </label>
              {thumbnail && <button type="button" onClick={() => { if (thumbnail.startsWith("blob:")) URL.revokeObjectURL(thumbnail); mediaUrls.current.delete(thumbnail); setThumbnail(null); }} className="mt-2 text-xs font-semibold text-[#da6b43] hover:text-[#bd5835]">Remove thumbnail</button>}
              {thumbnailError && <p className="mt-2 text-sm font-medium text-[#b84d32]">{thumbnailError}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5a7068]">Gallery <span className="font-normal normal-case tracking-normal text-[#789087]">(optional)</span></p>
                <span className="text-xs text-[#789087]">{gallery.length}/6 images</span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {gallery.map((image, index) => (
                  <div key={image} className="group relative aspect-square overflow-hidden bg-[#e9efe8]">
                    <Image src={image} alt={`Gallery preview ${index + 1}`} fill unoptimized className="object-cover" />
                    <button type="button" aria-label={`Remove gallery image ${index + 1}`} onClick={() => removeGalleryImage(image)} className="absolute right-1 top-1 grid size-7 place-items-center bg-[#173b35]/85 text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100">
                      <X aria-hidden="true" className="size-4" />
                    </button>
                  </div>
                ))}
                {gallery.length < 6 && (
                  <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 border border-dashed border-[#b8c4b9] bg-[#f5f7f2] text-center text-xs font-semibold text-[#5a7068] hover:border-[#da6b43] hover:text-[#173b35]">
                    <ImagePlus aria-hidden="true" className="size-5 text-[#da6b43]" />
                    Add images
                    <input type="file" name="gallery" accept="image/png,image/jpeg,image/webp" multiple onChange={handleGalleryChange} className="sr-only" />
                  </label>
                )}
              </div>
            </div>
          </div>
        </fieldset>
      </div>

      <div className="mt-8 flex flex-col-reverse justify-between gap-4 border-t border-[#d8ded8] pt-6 sm:flex-row sm:items-center">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#5a7068] hover:text-[#173b35]"><ArrowLeft aria-hidden="true" className="size-4" /> Cancel</Link>
        <div className="flex flex-col items-end gap-2">
          {submitError && <p role="alert" className="text-sm text-[#b84d32]">{submitError}</p>}
          <Button type="submit" disabled={isSubmitting} className="h-12 gap-2 bg-[#173b35] px-6 text-[#f5f7f2] hover:bg-[#28584e]">{isSubmitting ? "Publishing..." : "Submit event"} <ArrowUpRight aria-hidden="true" className="size-4" /></Button>
        </div>
      </div>
      </form>
    </Form>
  );
}
