import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CodePacker Catalog - Showcase Karya Siswa RPL SMKN 4 Malang",
  description: "Platform portofolio digital yang menampilkan project-project terbaik dari siswa Rekayasa Perangkat Lunak SMKN 4 Malang.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
