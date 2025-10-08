import { HeroSection } from "@/components/hero-section-1";
import AboutCodePackerCatalog from "@/components/features-1";
import CodePackerMainFeatures from "@/components/features-8";
import CodePackerCatalogFAQ from "@/components/faqs-3";

export default function Home() {
  // Mock data for featured projects and students
  const featuredProjects = [
    {
      id: "1",
      title: "E-Commerce Mobile App",
      description: "Aplikasi mobile e-commerce dengan fitur lengkap menggunakan React Native dan Firebase",
      thumbnail: "/api/placeholder/400/300",
      studentName: "John Doe",
      studentId: "1",
      githubUrl: "https://github.com/johndoe/ecommerce-app",
      liveDemoUrl: "https://ecommerce-demo.com",
      techStacks: ["React Native", "Firebase", "Redux", "TypeScript"],
      category: "Mobile"
    },
    {
      id: "2", 
      title: "School Management System",
      description: "Sistem manajemen sekolah berbasis web dengan dashboard admin dan siswa",
      thumbnail: "/api/placeholder/400/300",
      studentName: "Jane Smith",
      studentId: "2",
      githubUrl: "https://github.com/janesmith/school-system",
      liveDemoUrl: "https://school-demo.com",
      techStacks: ["Next.js", "PostgreSQL", "Prisma", "Tailwind"],
      category: "Web"
    },
    {
      id: "3",
      title: "AI Chatbot Assistant", 
      description: "Chatbot AI untuk customer service dengan natural language processing",
      thumbnail: "/api/placeholder/400/300",
      studentName: "Mike Johnson",
      studentId: "3",
      githubUrl: "https://github.com/mikejohnson/ai-chatbot",
      techStacks: ["Python", "TensorFlow", "Flask", "OpenAI"],
      category: "AI"
    }
  ];

  const featuredStudents = [
    {
      id: "1",
      fullName: "John Doe",
      bio: "Full-stack developer dengan passion di mobile development dan UI/UX design",
      profilePhotoUrl: "/api/placeholder/150/150",
      githubUrl: "https://github.com/johndoe",
      linkedinUrl: "https://linkedin.com/in/johndoe",
      skills: ["React Native", "Node.js", "UI/UX", "Firebase"],
      projectCount: 8
    },
    {
      id: "2", 
      fullName: "Jane Smith",
      bio: "Backend developer yang fokus pada sistem database dan API development",
      profilePhotoUrl: "/api/placeholder/150/150",
      githubUrl: "https://github.com/janesmith",
      linkedinUrl: "https://linkedin.com/in/janesmith",
      skills: ["PostgreSQL", "Express.js", "Docker", "AWS"],
      projectCount: 12
    }
  ];

  return (
    <>
      <HeroSection />
      <AboutCodePackerCatalog />
      <CodePackerMainFeatures />
      <CodePackerCatalogFAQ />
    </>
  );
}
