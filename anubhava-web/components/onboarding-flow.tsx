"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";

const questions = [
  {
    question: "Are you married or single?",
    description: "This helps us tailor your experience.",
    options: ["Married", "Single", "Prefer not to say"],
    multiple: false,
  },
  {
    question: "What are your hobbies?",
    description: "Choose as many as you like.",
    options: ["Reading", "Travel", "Music", "Sports", "Cooking", "Arts"],
    multiple: true,
  },
  {
    question: "How do you prefer to work?",
    description: "We will use this to personalize your workspace.",
    options: ["Solo", "With a small team", "With a large team"],
    multiple: false,
  },
  {
    question: "What brings you to Anubhava?",
    description: "Tell us what you want to make room for.",
    options: ["Organize my work", "Grow my business", "Collaborate better", "Explore ideas"],
    multiple: false,
  },
] as const;

export function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [isComplete, setIsComplete] = useState(false);
  const currentQuestion = questions[step];
  const currentAnswers = answers[step] ?? [];

  const selectAnswer = (answer: string) => {
    setAnswers((previous) => ({
      ...previous,
      [step]: currentQuestion.multiple
        ? currentAnswers.includes(answer)
          ? currentAnswers.filter((item) => item !== answer)
          : [...currentAnswers, answer]
        : [answer],
    }));
  };

  if (isComplete) {
    return (
      <div className="mx-auto flex min-h-[520px] w-full max-w-2xl flex-col items-center justify-center text-center">
        <span className="grid size-14 place-items-center rounded-full bg-[#dbe8d9] text-[#173b35]"><Check aria-hidden="true" className="size-7" /></span>
        <h1 className="mt-6 font-serif text-5xl leading-none text-[#173b35]">You&apos;re all set.</h1>
        <p className="mt-4 max-w-sm text-sm leading-6 text-[#5a7068]">Your Anubhava experience is ready. Let&apos;s make room for meaningful work.</p>
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
      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {currentQuestion.options.map((option) => {
          const selected = currentAnswers.includes(option);
          return <button key={option} type="button" aria-pressed={selected} onClick={() => selectAnswer(option)} className={`min-h-14 border px-5 py-4 text-left text-sm font-semibold transition-colors ${selected ? "border-[#173b35] bg-[#dbe8d9] text-[#173b35]" : "border-[#c7d2c8] bg-white text-[#5a7068] hover:border-[#173b35] hover:text-[#173b35]"}`}>{option}</button>;
        })}
      </div>
      <div className="mt-10 flex items-center justify-between">
        <Button type="button" variant="ghost" disabled={step === 0} onClick={() => setStep((value) => value - 1)} className="gap-2 px-0 text-[#5a7068] hover:bg-transparent hover:text-[#173b35]"><ArrowLeft aria-hidden="true" className="size-4" /> Back</Button>
        <Button type="button" disabled={currentAnswers.length === 0} onClick={() => step === questions.length - 1 ? setIsComplete(true) : setStep((value) => value + 1)} className="gap-2 bg-[#173b35] px-6 text-[#f5f7f2] hover:bg-[#28584e]">{step === questions.length - 1 ? "Finish" : "Next"}<ArrowUpRight aria-hidden="true" className="size-4" /></Button>
      </div>
    </div>
  );
}
