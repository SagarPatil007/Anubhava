"use client";

import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";

const cities = ["Pune", "Mumbai", "Bengaluru", "Delhi", "Hyderabad", "Chennai", "Kolkata"];

export function CitySelector() {
  const [city, setCity] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const refreshCity = () => {
      setIsSignedIn(Boolean(window.localStorage.getItem("anubhava_user_email")));
      setCity(window.localStorage.getItem("anubhava_user_city") ?? "");
    };
    refreshCity();
    window.addEventListener("anubhava-city-changed", refreshCity);
    window.addEventListener("anubhava-auth-changed", refreshCity);
    return () => {
      window.removeEventListener("anubhava-city-changed", refreshCity);
      window.removeEventListener("anubhava-auth-changed", refreshCity);
    };
  }, []);

  if (!isSignedIn) return null;

  const updateCity = (value: string) => {
    setCity(value);
    window.localStorage.setItem("anubhava_user_city", value);
    window.dispatchEvent(new Event("anubhava-city-changed"));
  };

  return (
    <label className="flex items-center gap-1.5 border border-[#c7d2c8] bg-[#fbfcf8] px-2.5 py-2 text-sm font-semibold text-[#173b35]">
      <MapPin aria-hidden="true" className="size-4 text-[#da6b43]" />
      <span className="sr-only">Select city</span>
      <select value={city} onChange={(event) => updateCity(event.target.value)} className="max-w-28 bg-transparent text-sm outline-none">
        <option value="">Select city</option>
        {cities.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
    </label>
  );
}