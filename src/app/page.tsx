import { HeroSection } from "@/components/hero-section-1"
import { TopProjects } from "@/components/top-projects"
import { TopStudents } from "@/components/top-students"
import AboutCodePackerCatalog from "@/components/features-1"
import CodePackerCatalogFAQ from "@/components/faqs-3"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <AboutCodePackerCatalog />
      <TopProjects />
      <TopStudents />
      <CodePackerCatalogFAQ />
      <Footer />
    </main>
  )
}
