export interface AssessmentCriteria {
  codeQuality: number;
  functionality: number;
  uiDesign: number;
  userExperience: number;
  responsiveness: number;
  documentation: number;
  creativity: number;
  technologyImplementation: number;
  performance: number;
  deployment: number;
}

export interface AssessmentScores {
  codeQuality: number;
  functionality: number;
  uiDesign: number;
  userExperience: number;
  responsiveness: number;
  documentation: number;
  creativity: number;
  technologyImplementation: number;
  performance: number;
  deployment: number;
}

export interface ProjectForAssessment {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  githubUrl: string;
  liveDemoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  student: {
    id: string;
    fullName: string;
    profilePhotoUrl: string | null;
    user: {
      id: string;
      username: string;
      email: string;
    };
    class: {
      id: string;
      name: string;
    } | null;
  };
  category: {
    id: string;
    name: string;
  } | null;
  assessment: {
    id: string;
    codeQuality: number;
    functionality: number;
    uiDesign: number;
    userExperience: number;
    responsiveness: number;
    documentation: number;
    creativity: number;
    technologyImplementation: number;
    performance: number;
    deployment: number;
    finalGrade: string;
    totalScore: number;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

export const ASSESSMENT_CRITERIA = {
  codeQuality: {
    name: "Kualitas Kode",
    description: "Penilaian terhadap struktur, kebersihan, dan kualitas kode yang ditulis"
  },
  functionality: {
    name: "Fungsionalitas",
    description: "Seberapa baik aplikasi berfungsi sesuai dengan requirements"
  },
  uiDesign: {
    name: "Desain UI",
    description: "Kualitas desain antarmuka pengguna, estetika, dan konsistensi visual"
  },
  userExperience: {
    name: "User Experience",
    description: "Kemudahan penggunaan, navigasi, dan pengalaman pengguna secara keseluruhan"
  },
  responsiveness: {
    name: "Responsivitas",
    description: "Kemampuan aplikasi beradaptasi dengan berbagai ukuran layar dan perangkat"
  },
  documentation: {
    name: "Dokumentasi",
    description: "Kualitas dokumentasi kode, README, dan penjelasan proyek"
  },
  creativity: {
    name: "Kreativitas & Inovasi",
    description: "Tingkat kreativitas, inovasi, dan keunikan dalam solusi yang dibuat"
  },
  technologyImplementation: {
    name: "Implementasi Teknologi",
    description: "Penggunaan teknologi yang tepat dan implementasi fitur-fitur modern"
  },
  performance: {
    name: "Performa & Optimisasi",
    description: "Kecepatan loading, optimisasi, dan performa aplikasi secara keseluruhan"
  },
  deployment: {
    name: "Deployment & Live Demo",
    description: "Keberhasilan deployment dan kualitas live demo yang dapat diakses"
  }
} as const;

export function calculateFinalGrade(scores: AssessmentScores): string {
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  
  // Grade berdasarkan total skor dari 100 poin (10 kriteria x 10 poin maksimal)
  if (totalScore >= 90) return 'A';
  if (totalScore >= 80) return 'B';
  if (totalScore >= 70) return 'C';
  if (totalScore >= 60) return 'D';
  return 'E';
}

export function calculateTotalScore(scores: AssessmentScores): number {
  return Object.values(scores).reduce((sum: number, score: number) => sum + score, 0);
}