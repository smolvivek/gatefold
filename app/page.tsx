import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LandingHero } from "@/components/landing/LandingHero";
import { SoundToggle } from "@/components/ui/SoundToggle";

export default async function Home() {
  let user = null;
  let profile = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;

    if (user) {
      const { data: profileData } = await supabase
        .from("users")
        .select("name, email")
        .eq("auth_id", user.id)
        .single();
      profile = profileData;
    }
  } catch {
    // Supabase unreachable — render as logged-out
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gatefold.app";
  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Gatefold",
    url: siteUrl,
    description: "Present, fund, and evolve your creative work.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[24px] md:px-[48px] h-[72px] bg-background/90 backdrop-blur-sm border-b border-hairline">
        <Link
          href="/"
          className="font-heading text-[20px] font-bold uppercase tracking-tighter text-text-primary"
        >
          Gatefold
        </Link>
        <div className="flex items-center gap-[16px] md:gap-[32px]">
          <Link
            href="/pricing"
            className="hidden md:inline font-heading text-[15px] uppercase tracking-tighter text-text-secondary hover:text-text-primary transition-colors duration-[200ms] ease-out"
          >
            Pricing
          </Link>
          {!(user && profile) && (
            <Link
              href="/login"
              className="font-heading text-[15px] uppercase tracking-tighter text-text-secondary hover:text-text-primary transition-colors duration-[200ms] ease-out"
            >
              Sign In
            </Link>
          )}
          <SoundToggle />
          {user && profile ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center bg-pop text-background px-[20px] py-[10px] font-heading text-[13px] font-bold uppercase tracking-tighter hover:bg-pop-hover transition-colors duration-[200ms]"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/signup"
              className="inline-flex items-center bg-pop text-background px-[20px] py-[10px] font-heading text-[13px] font-bold uppercase tracking-tighter hover:bg-pop-hover transition-colors duration-[200ms]"
            >
              Join
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <LandingHero />
    </div>
  );
}
