"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type EventGalleryProps = {
  title: string;
  images: string[];
};

export function EventGallery({ title, images }: EventGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + images.length) % images.length);
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % images.length);
  };

  return (
    <div className="mt-7">
      <div className="relative aspect-[16/9] overflow-hidden bg-[#e9efe8] sm:aspect-[2/1]">
        <Image
          src={activeImage}
          alt={`${title} gallery image ${activeIndex + 1}`}
          fill
          unoptimized
          priority={activeIndex === 0}
          sizes="(max-width: 1024px) 100vw, 90vw"
          className="object-cover transition-opacity duration-300"
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-[#173b35]/75 to-transparent px-4 pb-4 pt-14 sm:px-6">
          <span className="text-sm font-semibold text-white">{activeIndex + 1} / {images.length}</span>
          <div className="flex gap-2">
            <button type="button" aria-label="Previous gallery image" onClick={showPrevious} className="grid size-10 place-items-center bg-[#fbfcf8] text-[#173b35] transition-colors hover:bg-[#da6b43] hover:text-white">
              <ArrowLeft aria-hidden="true" className="size-4" />
            </button>
            <button type="button" aria-label="Next gallery image" onClick={showNext} className="grid size-10 place-items-center bg-[#fbfcf8] text-[#173b35] transition-colors hover:bg-[#da6b43] hover:text-white">
              <ArrowRight aria-hidden="true" className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-3 overflow-x-auto pb-1" aria-label="Choose gallery image">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            aria-label={`Show gallery image ${index + 1}`}
            aria-current={activeIndex === index}
            onClick={() => setActiveIndex(index)}
            className={`relative size-20 shrink-0 overflow-hidden border-2 bg-[#e9efe8] transition-opacity sm:size-24 ${activeIndex === index ? "border-[#da6b43]" : "border-transparent opacity-60 hover:opacity-100"}`}
          >
            <Image src={image} alt="" fill unoptimized sizes="96px" className="object-cover" />
          </button>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-2" aria-hidden="true">
        {images.map((image, index) => (
          <span key={image} className={`h-1.5 transition-all ${activeIndex === index ? "w-8 bg-[#da6b43]" : "w-1.5 bg-[#b8c4b9]"}`} />
        ))}
      </div>
    </div>
  );
}
