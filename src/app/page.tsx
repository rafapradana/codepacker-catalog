import { HeroSection } from "@/components/hero-section-1";
import AboutCodePackerCatalog from "@/components/features-1";
import CodePackerMainFeatures from "@/components/features-8";
import CodePackerCatalogFAQ from "@/components/faqs-3";
import { RedirectHandler } from "@/components/redirect-handler";

export default function Home() {
  return (
    <>
      <RedirectHandler />
      <HeroSection />
      <AboutCodePackerCatalog />
      <CodePackerMainFeatures />
      <CodePackerCatalogFAQ />
    </>
  );
}
