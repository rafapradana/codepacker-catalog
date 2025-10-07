"use client";

import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink, Github, User, Calendar, Clock } from "lucide-react";
import { Poppins } from "next/font/google";
import { use } from "react";

const poppins = Poppins({
  weight: ["700"],
  subsets: ["latin"],
});

// Mock data - in real app, this would come from API/database
const projectsData: Record<string, any> = {
  "1": {
    id: "1",
    title: "Weather Prediction ML",
    description: "Platform prediksi cuaca lengkap dengan machine learning terintegrasi. Sistem ini mencakup analisis data historis, algoritma neural network untuk akurasi tinggi, dan dashboard yang komprehensif untuk monitoring prediksi cuaca secara real-time.",
    thumbnail: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=600&fit=crop",
    studentName: "Izzamah Zahra",
    studentId: "1",
    profilePhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    githubUrl: "https://github.com",
    liveDemoUrl: "https://demo.com",
    techStacks: ["Python", "TensorFlow", "Django", "PostgreSQL"],
    category: "Web",
    createdAt: "18 Januari 2024",
    updatedAt: "12 April 2025",
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop"
    ]
  },
  "2": {
    id: "2",
    title: "E-Commerce Dashboard",
    description: "Platform e-commerce lengkap dengan payment gateway terintegrasi. Sistem ini mencakup manajemen produk, keranjang belanja, dan admin dashboard yang komprehensif untuk monitoring transaksi dan inventori secara real-time.",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    studentName: "Ahmad Rizki Pratama",
    studentId: "2",
    profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    githubUrl: "https://github.com",
    liveDemoUrl: "https://demo.com",
    techStacks: ["React", "TypeScript", "Node.js", "MongoDB"],
    category: "Web",
    createdAt: "18 Januari 2024",
    updatedAt: "12 April 2025",
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop"
    ]
  },
  "3": {
    id: "3",
    title: "Platformer Game 2D",
    description: "Game platformer 2D retro style dengan mekanik lompat yang smooth. Sistem ini mencakup power-ups, sistem scoring, dan level design yang menarik untuk pengalaman bermain yang menyenangkan.",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop",
    studentName: "Eko Prasetyo",
    studentId: "3",
    profilePhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    githubUrl: "https://github.com",
    liveDemoUrl: "https://demo.com",
    techStacks: ["Unity", "C#", "Photoshop"],
    category: "Game",
    createdAt: "18 Januari 2024",
    updatedAt: "12 April 2025",
    images: [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=500&fit=crop"
    ]
  }
};

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const project = projectsData[id] || projectsData["1"];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="pt-12 pb-8 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <Link 
            href="/projects"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to profile</span>
          </Link>

          {/* Title */}
          <h1 className={`text-4xl md:text-5xl font-bold text-blue-600 mb-6 ${poppins.className}`}>
            {project.title}
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-base leading-relaxed mb-6">
            {project.description}
          </p>

          {/* Student Info */}
          <div className="flex items-center gap-3 mb-4">
            {project.profilePhoto ? (
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={project.profilePhoto}
                  alt={project.studentName}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {project.studentName.charAt(0)}
              </div>
            )}
            <div>
              <Link 
                href={`/students/${project.studentId}`}
                className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                <User className="w-3.5 h-3.5" />
                {project.studentName}
              </Link>
            </div>
            <span className="text-gray-300">•</span>
            <span className="text-sm text-gray-600">XI RPL C</span>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Created At {project.createdAt}</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Last Update {project.updatedAt}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {project.liveDemoUrl && (
              <Button asChild variant="outline" className="rounded-lg border-gray-300">
                <Link href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Demo</span>
                </Link>
              </Button>
            )}
            {project.githubUrl && (
              <Button asChild variant="outline" className="rounded-lg border-gray-300">
                <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  <span>Source Code</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Project Images */}
      <section className="pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-6">
            {project.images.map((image: string, index: number) => (
              <div key={index} className="relative w-full h-96 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={image}
                  alt={`${project.title} screenshot ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
