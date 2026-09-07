import { SiteFooter } from "@/components/site-footer";
import { OnboardingFlow } from "@/components/onboarding-flow";

export default function OnboardingPage() {
  return (
    <div className="min-h-full bg-[#f5f7f2] text-[#173b35]">
      <main className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-16 lg:px-10">
        <OnboardingFlow />
      </main>
      <SiteFooter />
    </div>
  );
}
