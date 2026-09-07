"use client";

import { ArrowLeft, ArrowUpRight, Check, ImagePlus, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const inputClassName =
  "mt-2 h-12 rounded-none border-[#c7d2c8] bg-[#fbfcf8] text-sm text-[#173b35] placeholder:text-[#8a9a91] focus-visible:border-[#da6b43] focus-visible:ring-[#da6b43]/20";
const textareaClassName =
  "mt-2 min-h-32 w-full resize-y border border-[#c7d2c8] bg-[#fbfcf8] px-3 py-3 text-sm leading-6 text-[#173b35] outline-none placeholder:text-[#8a9a91] focus:border-[#da6b43] focus:ring-3 focus:ring-[#da6b43]/20";

export function CreateEventForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const mediaUrls = useRef(new Set<string>());

  useEffect(() => {
    const urls = mediaUrls.current;
    return () => {
      urls.forEach((image) => URL.revokeObjectURL(image));
    };
  }, []);

  const handleThumbnailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (thumbnail) {
      URL.revokeObjectURL(thumbnail);
      mediaUrls.current.delete(thumbnail);
    }
    const previewUrl = URL.createObjectURL(file);
    mediaUrls.current.add(previewUrl);
    setThumbnail(previewUrl);
  };

  const handleGalleryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).slice(0, 6 - gallery.length);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    previewUrls.forEach((image) => mediaUrls.current.add(image));
    setGallery((current) => [...current, ...previewUrls]);
  };

  const removeGalleryImage = (image: string) => {
    URL.revokeObjectURL(image);
    mediaUrls.current.delete(image);
    setGallery((current) => current.filter((item) => item !== image));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
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
    <form onSubmit={handleSubmit} className="border border-[#c7d2c8] bg-[#fbfcf8] p-6 sm:p-10">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block sm:col-span-2 text-sm font-semibold text-[#173b35]">
          Event name <span className="text-[#da6b43]">*</span>
          <Input required name="title" placeholder="e.g. The Makers Table" className={inputClassName} />
        </label>

        <label className="block text-sm font-semibold text-[#173b35]">
          Category <span className="text-[#da6b43]">*</span>
          <select required name="category" defaultValue="" className={inputClassName}>
            <option value="" disabled>Choose a category</option>
            <option>Community</option>
            <option>Talks</option>
            <option>Wellbeing</option>
            <option>Workshop</option>
            <option>Gathering</option>
          </select>
        </label>

        <label className="block text-sm font-semibold text-[#173b35]">
          Location <span className="text-[#da6b43]">*</span>
          <Input required name="location" placeholder="Venue or online link" className={inputClassName} />
        </label>

        <label className="block text-sm font-semibold text-[#173b35]">
          Date <span className="text-[#da6b43]">*</span>
          <Input required name="date" type="date" className={inputClassName} />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm font-semibold text-[#173b35]">
            Starts <span className="text-[#da6b43]">*</span>
            <Input required name="startTime" type="time" className={inputClassName} />
          </label>
          <label className="block text-sm font-semibold text-[#173b35]">
            Ends <span className="text-[#da6b43]">*</span>
            <Input required name="endTime" type="time" className={inputClassName} />
          </label>
        </div>

        <label className="block text-sm font-semibold text-[#173b35] sm:col-span-2">
          Short description <span className="text-[#da6b43]">*</span>
          <textarea required name="description" placeholder="What will people experience?" className={textareaClassName} />
        </label>

        <label className="block text-sm font-semibold text-[#173b35] sm:col-span-2">
          More details
          <textarea name="details" placeholder="Share the rhythm of the event, who it is for, and what to bring." className={textareaClassName} />
        </label>

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
                <input required={!thumbnail} type="file" name="thumbnail" accept="image/png,image/jpeg,image/webp" onChange={handleThumbnailChange} className="sr-only" />
              </label>
              {thumbnail && <button type="button" onClick={() => { URL.revokeObjectURL(thumbnail); mediaUrls.current.delete(thumbnail); setThumbnail(null); }} className="mt-2 text-xs font-semibold text-[#da6b43] hover:text-[#bd5835]">Remove thumbnail</button>}
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
        <Button type="submit" className="h-12 gap-2 bg-[#173b35] px-6 text-[#f5f7f2] hover:bg-[#28584e]">Submit event <ArrowUpRight aria-hidden="true" className="size-4" /></Button>
      </div>
    </form>
  );
}
