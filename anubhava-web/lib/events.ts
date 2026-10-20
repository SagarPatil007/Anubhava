export type EventItem = {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  description: string;
  details: string;
  color: string;
  icon: string;
  thumbnail: string;
  gallery: string[];
};

export const events: EventItem[] = [
  {
    id: "creative-mornings",
    title: "Creative Mornings",
    category: "Community",
    date: "Sep 12, 2026",
    time: "9:00 AM - 11:30 AM",
    location: "The Foundry, Bengaluru",
    description: "A bright morning of ideas, coffee, and conversations with people making meaningful things.",
    details: "Start your day with an open room of curious minds. Creative Mornings brings designers, founders, artists, and builders together for a short talk followed by generous conversation. Come with a question, leave with a new perspective.",
    color: "bg-[#dbe8d9]",
    icon: "✦",
    thumbnail: "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=85",
    ],
  },
  {
    id: "future-of-work",
    title: "The Future of Work",
    category: "Talks",
    date: "Sep 19, 2026",
    time: "6:30 PM - 8:30 PM",
    location: "The Leela Palace, Mumbai",
    description: "A grounded conversation about how teams can work with more trust, focus, and imagination.",
    details: "What does a truly human workplace look like? Join leaders from across technology, culture, and business for an honest conversation about designing work around people instead of processes.",
    color: "bg-[#f2dccb]",
    icon: "◌",
    thumbnail: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1000&q=85",
    ],
  },
  {
    id: "slow-sunday",
    title: "Slow Sunday Studio",
    category: "Wellbeing",
    date: "Sep 27, 2026",
    time: "10:00 AM - 1:00 PM",
    location: "Anubhava House, Goa",
    description: "A half-day studio for stepping away from the noise and returning to what matters.",
    details: "A gentle, guided studio day with journaling, a shared meal, and space to think. No performance, no packed agenda, just a considered morning designed to help you hear your own next idea.",
    color: "bg-[#e8dfc8]",
    icon: "☼",
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1000&q=85",
    ],
  },
  {
    id: "makers-table",
    title: "The Makers Table",
    category: "Workshop",
    date: "Oct 03, 2026",
    time: "11:00 AM - 3:00 PM",
    location: "Studio 4, Hyderabad",
    description: "A practical workshop for turning a loose idea into something you can share with the world.",
    details: "Bring an idea at any stage. With prompts, peer feedback, and a few useful constraints, you will leave with a clearer story, a first draft, and a room full of people rooting for the work.",
    color: "bg-[#d5e1e5]",
    icon: "＋",
    thumbnail: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85",
    ],
  },
  {
    id: "night-at-anubhava",
    title: "A Night at Anubhava",
    category: "Gathering",
    date: "Oct 17, 2026",
    time: "7:00 PM - 10:00 PM",
    location: "The Courtyard, Delhi",
    description: "An evening of music, food, and new introductions for the Anubhava community.",
    details: "Some ideas need a little atmosphere. Join us for a relaxed evening with live music, seasonal plates, and the kind of conversations that continue long after the room empties.",
    color: "bg-[#d8d9e6]",
    icon: "✺",
    thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1000&q=85",
    ],
  },
  {
    id: "storytelling-lab",
    title: "Storytelling Lab",
    category: "Workshop",
    date: "Oct 24, 2026",
    time: "2:00 PM - 5:00 PM",
    location: "The Reading Room, Pune",
    description: "Find the story inside your work and learn how to make it easier for others to feel it too.",
    details: "This intimate lab explores the simple structures behind memorable stories. You will work on your own material, test it with a small group, and leave with language that feels unmistakably yours.",
    color: "bg-[#e6d5d0]",
    icon: "❋",
    thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdea277a5?auto=format&fit=crop&w=1200&q=84",
    gallery: [
      "https://images.unsplash.com/photo-1455390582262-044cdea277a5?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1000&q=85",
    ],
  },
];

export function getEvent(id: string) {
  return events.find((event) => event.id === id);
}

export type BackendEvent = {
  eventId: number;
  eventName: string;
  eventType: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  thumbnailUrl?: string;
  imageUrls?: string[];
  description?: string;
  venue?: string;
  city?: string;
  paid?: boolean;
};

export function mapBackendEvent(event: BackendEvent): EventItem {
  const images = event.imageUrls?.filter(Boolean) ?? [];
  const thumbnail = event.thumbnailUrl || images[0] || "/event-placeholder.svg";
  const startDate = new Date(`${event.startDate}T00:00:00`);
  const date = Number.isNaN(startDate.getTime()) ? event.startDate : startDate.toLocaleDateString("en-IN", { month: "short", day: "2-digit", year: "numeric" });
  const time = [event.startTime, event.endTime].filter(Boolean).join(" - ");

  return {
    id: String(event.eventId),
    title: event.eventName,
    category: event.eventType,
    date,
    time,
    location: [event.venue, event.city].filter(Boolean).join(", "),
    description: event.description ?? "",
    details: event.description ?? "",
    color: "bg-[#dbe8d9]",
    icon: "✦",
    thumbnail,
    gallery: images.length > 0 ? images : [thumbnail],
  };
}
