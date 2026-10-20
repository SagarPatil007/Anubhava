"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type AuthMode = "login" | "signup";

type AuthModalProps = {
  mode: AuthMode;
  onClose: () => void;
  onModeChange: (mode: AuthMode) => void;
};

type ApiResponse = {
  success: boolean;
  message?: string;
  data?: unknown;
  errors?: Array<{ field?: string; message?: string }>;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

const onboardingQuestions = [
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

const inputClassName =
  "mt-2 h-12 rounded-none border-[#c7d2c8] bg-[#f5f7f2] text-sm text-[#173b35] placeholder:text-[#8a9a91] focus-visible:border-[#da6b43] focus-visible:ring-[#da6b43]/20";
const signupInputClassName =
  "mt-1 h-10 rounded-none border-[#c7d2c8] bg-[#f5f7f2] text-sm text-[#173b35] placeholder:text-[#8a9a91] focus-visible:border-[#da6b43] focus-visible:ring-[#da6b43]/20";

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M21.35 12.23c0-.73-.07-1.43-.2-2.1H12v3.98h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.27Z" />
      <path fill="#34A853" d="M12 21.6c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.53A9.74 9.74 0 0 0 12 21.6Z" />
      <path fill="#FBBC05" d="M6.53 13.68A5.85 5.85 0 0 1 6.22 12c0-.58.1-1.15.31-1.68V7.79H3.28A9.73 9.73 0 0 0 2.25 12c0 1.57.38 3.05 1.03 4.21l3.25-2.53Z" />
      <path fill="#EA4335" d="M12 6.29c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.38 14.63 2.4 12 2.4a9.74 9.74 0 0 0-8.72 5.39l3.25 2.53c.77-2.31 2.93-4.03 5.47-4.03Z" />
    </svg>
  );
}

export function AuthModal({ mode, onClose, onModeChange }: AuthModalProps) {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingAnswers, setOnboardingAnswers] = useState<Record<number, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentQuestion = onboardingQuestions[onboardingStep];
  const currentAnswers = onboardingAnswers[onboardingStep] ?? [];
  const hasAnswer = currentAnswers.length > 0;

  const selectAnswer = (answer: string) => {
    setOnboardingAnswers((previous) => ({
      ...previous,
      [onboardingStep]: currentQuestion.multiple
        ? currentAnswers.includes(answer)
          ? currentAnswers.filter((item) => item !== answer)
          : [...currentAnswers, answer]
        : [answer],
    }));
  };

  const finishOnboarding = () => {
    setIsOnboarding(false);
    setIsSubmitted(true);
  };

  const submitAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");

    if (mode === "signup" && !password.trim()) {
      setErrorMessage("Password is required.");
      setIsSubmitting(false);
      return;
    }

    const payload = mode === "login"
      ? {
          email: String(formData.get("email") ?? ""),
          password,
        }
      : {
          firstName: String(formData.get("firstName") ?? ""),
          lastName: String(formData.get("lastName") ?? ""),
          email: String(formData.get("email") ?? ""),
          phoneNumber: String(formData.get("phoneNumber") ?? ""),
          password,
        };

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/auth/${mode === "login" ? "login" : "signup"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const responseBody = await response.text();
      if (!responseBody.trim()) {
        throw new Error(
          `The authentication service returned an empty response (HTTP ${response.status}).`,
        );
      }

      let result: ApiResponse;
      try {
        result = JSON.parse(responseBody) as ApiResponse;
      } catch {
        throw new Error(
          `The authentication service returned an invalid response (HTTP ${response.status}).`,
        );
      }

      if (!response.ok || !result.success) {
        throw new Error(result.errors?.find((item) => item.message)?.message ?? result.message ?? "Authentication failed.");
      }

      if (mode === "login") {
        const loginEmail = String(formData.get("email") ?? "");
        const tokenData = result.data as { access_token?: string; accessToken?: string; refresh_token?: string } | undefined;
        const accessToken = tokenData?.access_token ?? tokenData?.accessToken;
        if (accessToken) {
          window.localStorage.setItem("anubhava_access_token", accessToken);
        }
        const refreshToken = tokenData?.refresh_token;
        if (refreshToken) {
          window.localStorage.setItem("anubhava_refresh_token", refreshToken);
        }
        window.localStorage.setItem("anubhava_user_email", loginEmail);
        window.dispatchEvent(new Event("anubhava-auth-changed"));
        window.dispatchEvent(new Event("anubhava-login-success"));
        onClose();
      } else {
        const signupEmail = String(formData.get("email") ?? "");
        if (typeof window !== "undefined") {
          window.localStorage.setItem("anubhava_user_email", signupEmail);
        }
        router.push(`/onboarding?email=${encodeURIComponent(signupEmail)}`);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to connect to the authentication service.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#173b35]/45 px-4 py-6 backdrop-blur-sm sm:py-10"
      onMouseDown={onClose}
    >
      <section
        aria-labelledby="auth-modal-title"
        aria-modal="true"
        role="dialog"
        className="relative h-[min(760px,calc(100vh-3rem))] max-h-[calc(100vh-3rem)] w-full max-w-[520px] overflow-hidden bg-[#fbfcf8] p-6 shadow-[0_24px_70px_rgba(23,59,53,0.24)] sm:p-10"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close authentication dialog"
          onClick={onClose}
          className="absolute right-5 top-5 grid size-9 place-items-center text-[#5a7068] transition-colors hover:bg-[#e9efe8] hover:text-[#173b35]"
        >
          <X aria-hidden="true" className="size-5" />
        </button>

        {isOnboarding ? (
          <div className="flex min-h-full flex-col justify-center">
            <div className="mb-8 pr-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#da6b43]">
                Make it yours
              </p>
              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-[#5a7068]">
                  Question {onboardingStep + 1} of {onboardingQuestions.length}
                </span>
                <div className="flex gap-1.5" aria-hidden="true">
                  {onboardingQuestions.map((_, index) => (
                    <span key={index} className={`h-1.5 w-8 ${index <= onboardingStep ? "bg-[#da6b43]" : "bg-[#d8ded8]"}`} />
                  ))}
                </div>
              </div>
              <h2 id="auth-modal-title" className="mt-6 font-serif text-4xl leading-none text-[#173b35]">
                {currentQuestion.question}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#5a7068]">{currentQuestion.description}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {currentQuestion.options.map((option) => {
                const isSelected = currentAnswers.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => selectAnswer(option)}
                    className={`min-h-12 border px-4 py-3 text-left text-sm font-semibold transition-colors ${isSelected ? "border-[#173b35] bg-[#dbe8d9] text-[#173b35]" : "border-[#c7d2c8] bg-[#f5f7f2] text-[#5a7068] hover:border-[#173b35] hover:text-[#173b35]"}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="ghost"
                disabled={onboardingStep === 0}
                onClick={() => setOnboardingStep((step) => step - 1)}
                className="gap-2 px-0 text-[#5a7068] hover:bg-transparent hover:text-[#173b35]"
              >
                <ArrowLeft aria-hidden="true" className="size-4" /> Back
              </Button>
              <Button
                type="button"
                disabled={!hasAnswer}
                onClick={() => onboardingStep === onboardingQuestions.length - 1 ? finishOnboarding() : setOnboardingStep((step) => step + 1)}
                className="gap-2 bg-[#173b35] px-5 text-[#f5f7f2] hover:bg-[#28584e]"
              >
                {onboardingStep === onboardingQuestions.length - 1 ? "Finish" : "Next"}
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </Button>
            </div>
          </div>
        ) : isSubmitted ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
            <span className="grid size-14 place-items-center rounded-full bg-[#dbe8d9] text-[#173b35]">
              <Check aria-hidden="true" className="size-7" />
            </span>
            <h2 id="auth-modal-title" className="mt-6 font-serif text-4xl text-[#173b35]">
              You&apos;re on your way.
            </h2>
            <p className="mt-3 max-w-xs text-sm leading-6 text-[#5a7068]">
              This demo form is ready to connect to your authentication provider.
            </p>
            <Button
              type="button"
              onClick={onClose}
              className="mt-8 inline-flex items-center gap-2 bg-[#173b35] px-5 py-3 text-sm font-semibold text-[#f5f7f2]"
            >
              Continue <ArrowUpRight aria-hidden="true" className="size-4" />
            </Button>
          </div>
        ) : isForgotPassword ? (
          <div className="flex min-h-full flex-col justify-center">
            <div className="mb-8 pr-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#da6b43]">
                Account recovery
              </p>
              <h2 id="auth-modal-title" className="mt-3 font-serif text-4xl leading-none text-[#173b35]">
                Reset your password.
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#5a7068]">
                Enter your email and we&apos;ll send you a link to create a new password.
              </p>
            </div>
            <form
              className="space-y-5"
              onSubmit={async (event) => {
                event.preventDefault();
                setErrorMessage(null);
                setIsSubmitting(true);

                try {
                  const formData = new FormData(event.currentTarget);
                  const email = String(formData.get("recoveryEmail") ?? "");

                  const response = await fetch(`${apiBaseUrl}/api/v1/auth/forgot-password`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                  });

                  const result = (await response.json()) as ApiResponse;

                  if (!response.ok || !result.success) {
                    throw new Error(result.errors?.find((item) => item.message)?.message ?? result.message ?? "Unable to send reset link.");
                  }

                  setIsSubmitted(true);
                } catch (error) {
                  setErrorMessage(error instanceof Error ? error.message : "Unable to send reset link.");
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              <label className="block text-sm font-semibold text-[#173b35]">
                Email address
                <Input required maxLength={254} name="recoveryEmail" type="email" autoComplete="email" placeholder="you@company.com" className={inputClassName} />
              </label>
              {errorMessage && (
                <p role="alert" className="text-sm text-[#b84d32]">
                  {errorMessage}
                </p>
              )}
              <Button disabled={isSubmitting} type="submit" className="flex h-12 w-full items-center justify-center gap-2 bg-[#173b35] text-sm font-semibold text-[#f5f7f2] transition-colors hover:bg-[#28584e]">
                {isSubmitting ? "Sending..." : "Send reset link"} <ArrowUpRight aria-hidden="true" className="size-4" />
              </Button>
            </form>
            <button
              type="button"
              onClick={() => setIsForgotPassword(false)}
              className="mx-auto mt-7 flex items-center gap-2 text-sm font-semibold text-[#173b35] underline decoration-[#da6b43] underline-offset-4"
            >
              <ArrowLeft aria-hidden="true" className="size-3" /> Back to login
            </button>
          </div>
        ) : (
          <>
            <div className={`pr-8 ${mode === "signup" ? "mb-5" : "mb-8"}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#da6b43]">
                Anubhava account
              </p>
              <h2 id="auth-modal-title" className="mt-3 font-serif text-4xl leading-none text-[#173b35]">
                {mode === "login" ? "Welcome back." : "Start with clarity."}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#5a7068]">
                {mode === "login"
                  ? "Sign in to pick up where you left off."
                  : "Create an account and make room for meaningful work."}
              </p>
            </div>

            <Button
              type="button"
              onClick={() => setErrorMessage("Google sign-in is not configured yet. Please use your email.")}
              className="flex h-12 w-full items-center justify-center gap-3 border border-[#c7d2c8] bg-white text-sm font-semibold text-[#173b35] transition-colors hover:bg-[#e9efe8]"
            >
              <GoogleIcon />
              {mode === "login" ? "Sign in with Google" : "Sign up with Google"}
            </Button>

            <div className={`${mode === "signup" ? "my-4" : "my-7"} flex items-center gap-4 text-xs text-[#8a9a91]`}>
              <span className="h-px flex-1 bg-[#d8ded8]" />
              or use your email
              <span className="h-px flex-1 bg-[#d8ded8]" />
            </div>

            <form
              className={mode === "signup" ? "grid grid-cols-2 gap-x-3 gap-y-3" : "space-y-4"}
              onSubmit={submitAuth}
              autoComplete="off"
            >
              {mode === "signup" && (
                <div className="contents">
                  <label className="text-sm font-semibold text-[#173b35]">
                    First name
                    <Input required minLength={2} maxLength={80} pattern="[\p{L}][\p{L} .'-]{1,79}" title="Use 2–80 letters, spaces, apostrophes, periods, or hyphens." name="firstName" type="text" autoComplete="given-name" placeholder="Avery" className={signupInputClassName} />
                  </label>
                  <label className="text-sm font-semibold text-[#173b35]">
                    Last name
                    <Input required minLength={2} maxLength={80} pattern="[\p{L}][\p{L} .'-]{1,79}" title="Use 2–80 letters, spaces, apostrophes, periods, or hyphens." name="lastName" type="text" autoComplete="family-name" placeholder="Morgan" className={signupInputClassName} />
                  </label>
                </div>
              )}

              <label className={`${mode === "signup" ? "" : "block"} text-sm font-semibold text-[#173b35]`}>
                Email address
                <Input required maxLength={254} name="email" type="email" autoComplete="email" placeholder="you@company.com" className={mode === "signup" ? signupInputClassName : inputClassName} />
              </label>

              {mode === "signup" && (
                  <label className="text-sm font-semibold text-[#173b35]">
                  Mobile number
                    <Input required maxLength={24} pattern="(?=(?:\D*\d){7,15}\D*$)\+?[0-9() .-]+" title="Enter a phone number with 7 to 15 digits." name="phoneNumber" type="tel" autoComplete="tel" placeholder="+1 555 000 0000" className={signupInputClassName} />
                </label>
              )}

              <label className={`${mode === "signup" ? "" : "block"} text-sm font-semibold text-[#173b35]`}>
                Password
                <Input required minLength={mode === "signup" ? 8 : undefined} maxLength={72} pattern={mode === "signup" ? "(?=.*[A-Za-z])(?=.*[0-9]).*" : undefined} title={mode === "signup" ? "Use at least 8 characters, including a letter and a number." : undefined} name="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} placeholder="Enter your password" className={mode === "signup" ? signupInputClassName : inputClassName} />
              </label>

              {mode === "login" && (
                <div className="flex justify-end">
                  <button type="button" onClick={() => setIsForgotPassword(true)} className="cursor-pointer text-xs font-semibold text-[#da6b43] hover:underline">
                    Forgot password?
                  </button>
                </div>
              )}

              {errorMessage && (
                <p role="alert" className={`${mode === "signup" ? "col-span-2" : ""} text-sm text-[#b84d32]`}>
                  {errorMessage}
                </p>
              )}

              <Button disabled={isSubmitting} type="submit" className={`${mode === "signup" ? "col-span-2 h-10" : "h-12"} flex w-full items-center justify-center gap-2 bg-[#173b35] text-sm font-semibold text-[#f5f7f2] transition-colors hover:bg-[#28584e]`}>
                {isSubmitting ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </Button>
            </form>

            <p className={`${mode === "signup" ? "mt-4" : "mt-7"} text-center text-sm text-[#5a7068]`}>
              {mode === "login" ? "New to Anubhava?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => onModeChange(mode === "login" ? "signup" : "login")}
                className="cursor-pointer font-semibold text-[#173b35] underline decoration-[#da6b43] underline-offset-4"
              >
                {mode === "login" ? "Create an account" : "Log in"}
              </button>
            </p>
            <button type="button" onClick={onClose} className="mx-auto mt-3 flex cursor-pointer items-center gap-2 text-xs font-semibold text-[#8a9a91] hover:text-[#173b35]">
              <ArrowLeft aria-hidden="true" className="size-3" /> Back to site
            </button>
          </>
        )}
      </section>
    </div>
  );
}
