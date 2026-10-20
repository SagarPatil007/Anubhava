"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";

const questions = [
  {
    id: "address",
    question: "Where are you based?",
    description: "This helps us suggest people nearby and better-matched experiences.",
    type: "address",
  },
  {
    id: "hobbies",
    question: "What are your hobbies?",
    description: "Choose as many as you like.",
    type: "multi",
    options: ["Reading", "Travel", "Music", "Sports", "Cooking", "Arts", "Fitness", "Movies"],
  },
  {
    id: "preferredHobbies",
    question: "Which hobbies do you enjoy with others?",
    description: "Pick the ones you would like to match with.",
    type: "multi",
    options: ["Reading", "Travel", "Music", "Sports", "Cooking", "Arts", "Fitness", "Movies"],
  },
  {
    id: "maritalStatus",
    question: "Are you married or single?",
    description: "This helps us tailor your experience.",
    type: "single",
    options: ["Married", "Single", "Prefer not to say"],
  },
  {
    id: "alcoholPreference",
    question: "Alcohol preference",
    description: "Tell us what kind of experiences you prefer.",
    type: "single",
    options: ["Alcoholic", "Non-alcoholic"],
  },
  {
    id: "foodPreference",
    question: "Food preference",
    description: "This helps us recommend relevant communities and events.",
    type: "single",
    options: ["Veg", "Non-veg"],
  },
] as const;

const gatewayUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export function OnboardingFlow() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentQuestion = questions[step];
  const currentAnswers = answers[currentQuestion.id] ?? (currentQuestion.type === "multi" ? [] : "");
  const addressFields = ["addressLine", "city", "state", "country"] as const;
  const addressHasInput = addressFields.some((field) => Boolean(String(answers[field] ?? "").trim()))
    || Boolean(String(answers.zipCode ?? "").trim());

  const hasAnswer = currentQuestion.type === "multi"
    ? Array.isArray(currentAnswers) && currentAnswers.length > 0
    : currentQuestion.type === "address"
      ? addressFields.every((field) => {
        const value = String(answers[field] ?? "").trim();
        const maxLength = field === "addressLine" ? 255 : 100;
        return value.length > 0 && value.length <= maxLength;
      }) && /^[A-Za-z0-9 -]{3,12}$/.test(String(answers.zipCode ?? "").trim())
      : Boolean(String(currentAnswers ?? "").trim());

  const selectAnswer = (answer: string) => {
    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: currentQuestion.type === "multi"
        ? Array.isArray(currentAnswers)
          ? currentAnswers.includes(answer)
            ? currentAnswers.filter((item) => item !== answer)
            : [...currentAnswers, answer]
          : [answer]
        : answer,
    }));
  };

  const updateAddressAnswer = (field: string, value: string) => {
    setAnswers((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const completedAnswers = useMemo(() => ({
    email,
    addressLine: String(answers.addressLine ?? "").trim(),
    city: String(answers.city ?? "").trim(),
    state: String(answers.state ?? "").trim(),
    country: String(answers.country ?? "").trim(),
    zipCode: String(answers.zipCode ?? "").trim(),
    hobbies: Array.isArray(answers.hobbies) ? answers.hobbies.join(",") : "",
    preferredHobbies: Array.isArray(answers.preferredHobbies) ? answers.preferredHobbies.join(",") : "",
    maritalStatus: String(answers.maritalStatus ?? ""),
    alcoholPreference: String(answers.alcoholPreference ?? ""),
    foodPreference: String(answers.foodPreference ?? ""),
  }), [answers, email]);

  const submitPreferences = async () => {
    if (!email) {
      setError("User email is missing.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${gatewayUrl}/api/v1/users/preferences`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(completedAnswers),
      });

      const result = await response.json() as { success?: boolean; message?: string; errors?: Array<{ message?: string }> };

      if (!response.ok || !result.success) {
        throw new Error(result.errors?.find((item) => item.message)?.message ?? result.message ?? "Unable to save your preferences.");
      }

      window.localStorage.setItem("anubhava_user_city", String(answers.city ?? "").trim());
      window.dispatchEvent(new Event("anubhava-city-changed"));
      setIsComplete(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save your preferences.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return (
      <div className="mx-auto flex min-h-[520px] w-full max-w-2xl flex-col items-center justify-center text-center">
        <span className="grid size-14 place-items-center rounded-full bg-[#dbe8d9] text-[#173b35]"><Check aria-hidden="true" className="size-7" /></span>
        <h1 className="mt-6 font-serif text-5xl leading-none text-[#173b35]">You&apos;re all set.</h1>
        <p className="mt-4 max-w-sm text-sm leading-6 text-[#5a7068]">Your preferences have been saved. We&apos;ll use them to help you discover better matches.</p>
        <Link href="/" className="mt-8 inline-flex items-center gap-2 bg-[#173b35] px-5 py-3 text-sm font-semibold text-[#f5f7f2] hover:bg-[#28584e]">Go to Anubhava <ArrowUpRight aria-hidden="true" className="size-4" /></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-10 flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-[#5a7068]">Question {step + 1} of {questions.length}</span>
        <div className="flex gap-1.5" aria-label={`${step + 1} of ${questions.length} questions completed`}>
          {questions.map((_, index) => <span key={index} className={`h-1.5 w-12 ${index <= step ? "bg-[#da6b43]" : "bg-[#c7d2c8]"}`} />)}
        </div>
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#da6b43]">Make it yours</p>
      <h1 className="mt-4 max-w-xl font-serif text-5xl leading-[0.98] text-[#173b35] sm:text-6xl">{currentQuestion.question}</h1>
      <p className="mt-4 text-lg leading-7 text-[#5a7068]">{currentQuestion.description}</p>

      {currentQuestion.type === "address" && (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-[#173b35] sm:col-span-2">
            Address line
            <input required maxLength={255} type="text" value={String(answers.addressLine ?? "")} onChange={(event) => updateAddressAnswer("addressLine", event.target.value)} placeholder="House number and street" className="mt-2 h-12 w-full border border-[#c7d2c8] bg-white px-4 text-sm font-normal text-[#173b35] placeholder:text-[#8a9a91] outline-none transition-colors focus:border-[#da6b43] focus:ring-2 focus:ring-[#da6b43]/20" />
          </label>
          <label className="text-sm font-semibold text-[#173b35]">
            City
            <input required maxLength={100} type="text" value={String(answers.city ?? "")} onChange={(event) => updateAddressAnswer("city", event.target.value)} placeholder="Pune" className="mt-2 h-12 w-full border border-[#c7d2c8] bg-white px-4 text-sm font-normal text-[#173b35] placeholder:text-[#8a9a91] outline-none transition-colors focus:border-[#da6b43] focus:ring-2 focus:ring-[#da6b43]/20" />
          </label>
          <label className="text-sm font-semibold text-[#173b35]">
            State
            <input required maxLength={100} type="text" value={String(answers.state ?? "")} onChange={(event) => updateAddressAnswer("state", event.target.value)} placeholder="Maharashtra" className="mt-2 h-12 w-full border border-[#c7d2c8] bg-white px-4 text-sm font-normal text-[#173b35] placeholder:text-[#8a9a91] outline-none transition-colors focus:border-[#da6b43] focus:ring-2 focus:ring-[#da6b43]/20" />
          </label>
          <label className="text-sm font-semibold text-[#173b35]">
            Country
            <input required maxLength={100} type="text" value={String(answers.country ?? "")} onChange={(event) => updateAddressAnswer("country", event.target.value)} placeholder="India" className="mt-2 h-12 w-full border border-[#c7d2c8] bg-white px-4 text-sm font-normal text-[#173b35] placeholder:text-[#8a9a91] outline-none transition-colors focus:border-[#da6b43] focus:ring-2 focus:ring-[#da6b43]/20" />
          </label>
          <label className="text-sm font-semibold text-[#173b35]">
            Pincode
            <input required maxLength={12} pattern="[A-Za-z0-9 -]{3,12}" type="text" inputMode="text" value={String(answers.zipCode ?? "")} onChange={(event) => updateAddressAnswer("zipCode", event.target.value)} placeholder="411001" className="mt-2 h-12 w-full border border-[#c7d2c8] bg-white px-4 text-sm font-normal text-[#173b35] placeholder:text-[#8a9a91] outline-none transition-colors focus:border-[#da6b43] focus:ring-2 focus:ring-[#da6b43]/20" />
          </label>
        </div>
      )}

      {currentQuestion.type === "address" && addressHasInput && !hasAnswer && (
        <p role="alert" className="mt-4 text-sm text-[#b84d32]">Complete each address field and use a postal code with 3–12 letters, numbers, spaces, or hyphens.</p>
      )}

      {currentQuestion.type !== "address" && (
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {currentQuestion.options.map((option) => {
            const selected = currentQuestion.type === "multi"
              ? Array.isArray(currentAnswers) && currentAnswers.includes(option)
              : currentAnswers === option;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={selected}
                onClick={() => selectAnswer(option)}
                className={`min-h-14 border px-5 py-4 text-left text-sm font-semibold transition-colors ${selected ? "border-[#173b35] bg-[#dbe8d9] text-[#173b35]" : "border-[#c7d2c8] bg-white text-[#5a7068] hover:border-[#173b35] hover:text-[#173b35]"}`}
              >
                {option}
              </button>
            );
          })}
        </div>
      )}

      {error && (
        <p role="alert" className="mt-5 text-sm text-[#b84d32]">{error}</p>
      )}

      <div className="mt-10 flex items-center justify-between">
        <Button type="button" variant="ghost" disabled={step === 0} onClick={() => setStep((value) => value - 1)} className="gap-2 px-0 text-[#5a7068] hover:bg-transparent hover:text-[#173b35]"><ArrowLeft aria-hidden="true" className="size-4" /> Back</Button>
        <Button
          type="button"
          disabled={!hasAnswer || isSubmitting}
          onClick={() => {
            if (step === questions.length - 1) {
              void submitPreferences();
            } else {
              setStep((value) => value + 1);
            }
          }}
          className="gap-2 bg-[#173b35] px-6 text-[#f5f7f2] hover:bg-[#28584e]"
        >
          {isSubmitting ? "Saving..." : step === questions.length - 1 ? "Finish" : "Next"}
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </div>
  );
}
