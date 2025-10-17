import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { DynamicFavicon } from "@/components/dynamic-favicon";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Codepacker Catalog",
  description: "Platform Katalog Portofolio dan Social Network Siswa RPL SMKN 4 Malang.",
  keywords: ["SMK Negeri 4 Malang", "project siswa", "katalog project", "portfolio siswa", "karya siswa"],
  authors: [{ name: "SMK Negeri 4 Malang" }],
  creator: "SMK Negeri 4 Malang",
  publisher: "SMK Negeri 4 Malang",
  openGraph: {
    title: "Codepacker Catalog",
    description: "Platform Katalog Portofolio dan Social Network Siswa RPL SMKN 4 Malang.",
    url: "https://codepacker-catalog.vercel.app",
    siteName: "Katalog Project Siswa SMK Negeri 4 Malang",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Katalog Project Siswa SMK Negeri 4 Malang",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Codepacker Catalog",
    description: "Platform Katalog Portofolio dan Social Network Siswa RPL SMKN 4 Malang.",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DynamicFavicon />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
