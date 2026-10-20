"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "your email";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!password.trim() || !confirmPassword.trim()) {
      setError("Both fields are required.");
      return;
    }

    if (password.length < 8 || password.length > 72 || !/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
      setError("Password must be 8–72 characters and contain at least one letter and one number.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7f2] px-4">
        <div className="w-full max-w-md rounded-none border border-[#d8ded8] bg-[#fbfcf8] p-8 text-center shadow-[0_20px_50px_rgba(23,59,53,0.08)]">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#dbe8d9] text-[#173b35]">
            <Check aria-hidden="true" className="size-7" />
          </span>
          <h1 className="mt-6 font-serif text-4xl text-[#173b35]">Password updated</h1>
          <p className="mt-3 text-sm leading-6 text-[#5a7068]">
            Your password has been reset successfully for {email}.
          </p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-8 inline-flex items-center gap-2 bg-[#173b35] px-5 py-3 text-sm font-semibold text-[#f5f7f2] transition-colors hover:bg-[#28584e]"
          >
            Back to login <ArrowLeft aria-hidden="true" className="size-4" />
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7f2] px-4">
      <div className="w-full max-w-md rounded-none border border-[#d8ded8] bg-[#fbfcf8] p-8 shadow-[0_20px_50px_rgba(23,59,53,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#da6b43]">
          Account recovery
        </p>
        <h1 className="mt-4 font-serif text-4xl leading-none text-[#173b35]">Set a new password</h1>
        <p className="mt-3 text-sm leading-6 text-[#5a7068]">
          Choose a new password for <span className="font-semibold text-[#173b35]">{email}</span>.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5" autoComplete="off">
          <label className="block text-sm font-semibold text-[#173b35]">
            New password
            <input
              type="password"
              minLength={8}
              maxLength={72}
              pattern="(?=.*[A-Za-z])(?=.*[0-9]).*"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter a new password"
              className="mt-2 h-12 w-full border border-[#c7d2c8] bg-[#f5f7f2] px-3 text-sm text-[#173b35] placeholder:text-[#8a9a91] outline-none transition-colors focus:border-[#da6b43] focus:ring-2 focus:ring-[#da6b43]/20"
            />
          </label>

          <label className="block text-sm font-semibold text-[#173b35]">
            Confirm password
            <input
              type="password"
              minLength={8}
              maxLength={72}
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm your new password"
              className="mt-2 h-12 w-full border border-[#c7d2c8] bg-[#f5f7f2] px-3 text-sm text-[#173b35] placeholder:text-[#8a9a91] outline-none transition-colors focus:border-[#da6b43] focus:ring-2 focus:ring-[#da6b43]/20"
            />
          </label>

          {error && (
            <p role="alert" className="text-sm text-[#b84d32]">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center gap-2 bg-[#173b35] text-sm font-semibold text-[#f5f7f2] transition-colors hover:bg-[#28584e]"
          >
            Update password <ArrowUpRight aria-hidden="true" className="size-4" />
          </button>
        </form>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main className="flex min-h-screen items-center justify-center bg-[#f5f7f2] px-4"><div className="text-sm text-[#5a7068]">Loading reset form...</div></main>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
