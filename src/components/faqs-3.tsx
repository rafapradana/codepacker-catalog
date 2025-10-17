'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'
import Link from 'next/link'

import { ReactNode } from 'react'

type FAQItem = {
    id: string
    icon: IconName
    question: string
    answer: string | ReactNode
}

export default function CodePackerCatalogFAQ() {
    const faqItems: FAQItem[] = [
        {
            id: 'item-1',
            icon: 'users',
            question: 'Apa itu CodePacker Catalog?',
            answer: 'CodePacker Catalog adalah web app katalog & portofolio siswa RPL SMKN 4 Malang yang menampilkan project-project siswa dalam bentuk katalog online yang profesional. Platform ini memungkinkan siswa untuk showcase karya mereka kepada publik dan industri.',
        },
        {
            id: 'item-2',
            icon: 'user-plus',
            question: 'Bagaimana cara mendaftar sebagai siswa?',
            answer: 'Akun siswa dibuat oleh admin sekolah, tidak ada fitur registrasi mandiri. Jika Anda adalah siswa RPL SMKN 4 Malang dan belum memiliki akun, silakan hubungi admin untuk dibuatkan akun.',
        },
        {
            id: 'item-3',
            icon: 'folder-plus',
            question: 'Bagaimana cara menambahkan project ke portofolio?',
            answer: 'Setelah login sebagai siswa, Anda dapat mengelola project melalui dashboard. Anda bisa menambahkan judul project, thumbnail, deskripsi, link GitHub (wajib), link live demo (opsional), kategori project, tech stack, dan upload media/gambar.',
        },
        {
            id: 'item-4',
            icon: 'search',
            question: 'Bagaimana cara mencari project atau siswa tertentu?',
            answer: 'Anda dapat menggunakan fitur search dan filter yang tersedia. Di halaman Students, Anda bisa filter berdasarkan kelas & skills atau search berdasarkan nama. Di halaman Projects, Anda bisa filter berdasarkan tech stack, kategori, tahun, atau search berdasarkan judul project, deskripsi, atau nama siswa.',
        },
        {
            id: 'item-5',
            icon: 'code',
            question: 'Kategori project apa saja yang didukung?',
            answer: 'CodePacker Catalog mendukung berbagai kategori project termasuk Mobile App, Web Application, Game Development, Desktop Application, dan Command Line Interface (CLI). Setiap project juga dapat dilengkapi dengan tech stack tags untuk memudahkan pencarian.',
        },
        {
            id: 'item-6',
            icon: 'trophy',
            question: 'Bagaimana sistem algoritma CodePacker Catalog menentukan Top Projects dan Top Students?',
            answer: (
                <div className="space-y-6">
                    <p className="text-muted-foreground mb-4">
                      Sistem algoritma CodePacker Catalog menggunakan metode perhitungan skor komprehensif yang menggabungkan berbagai faktor kualitas dan engagement untuk memberikan ranking yang objektif dan akurat.
                    </p>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-foreground mb-4">Algoritma Top Projects</h4>
                        <p className="text-muted-foreground mb-4">Skor project dihitung menggunakan formula weighted scoring:</p>
                        
                        <div className="bg-muted/50 border border-border rounded-lg p-6 space-y-4">
                          <div className="text-center mb-4">
                            <div className="text-lg font-semibold text-foreground mb-2">Formula Utama</div>
                            <div className="bg-card border border-border rounded-lg p-4 font-mono text-sm">
                              <div className="text-primary font-bold">S<sub>project</sub> = (A × 0.4) + (E × 0.3) + (R × 0.2) + (C × 0.1)</div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-card border border-border rounded-lg p-4">
                              <div className="font-semibold text-foreground mb-2">Assessment Score (A) - 40%</div>
                              <div className="font-mono text-sm text-muted-foreground">
                                A = (total_score / 100) × 100
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Dinormalisasi dari project_assessments
                              </div>
                            </div>
                            
                            <div className="bg-card border border-border rounded-lg p-4">
                              <div className="font-semibold text-foreground mb-2">Engagement Score (E) - 30%</div>
                              <div className="font-mono text-sm text-muted-foreground">
                                E = min((likes / max_likes) × 100, 100)
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Berdasarkan project_likes relatif
                              </div>
                            </div>
                            
                            <div className="bg-card border border-border rounded-lg p-4">
                              <div className="font-semibold text-foreground mb-2">Recency Score (R) - 20%</div>
                              <div className="font-mono text-sm text-muted-foreground">
                                R = max(0, 100 - (days_old × 0.5))
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Project terbaru mendapat prioritas
                              </div>
                            </div>
                            
                            <div className="bg-card border border-border rounded-lg p-4">
                              <div className="font-semibold text-foreground mb-2">Completeness Score (C) - 10%</div>
                              <div className="font-mono text-sm text-muted-foreground">
                                C = Σ(field_exists) × 20
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                5 field: desc, thumbnail, demo, tech, media
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-foreground mb-4">Algoritma Top Students</h4>
                        <p className="text-muted-foreground mb-4">Skor siswa dihitung dengan agregasi weighted dari semua aspek:</p>
                        
                        <div className="bg-muted/50 border border-border rounded-lg p-6 space-y-4">
                          <div className="text-center mb-4">
                            <div className="text-lg font-semibold text-foreground mb-2">Formula Utama</div>
                            <div className="bg-card border border-border rounded-lg p-4 font-mono text-sm">
                              <div className="text-primary font-bold">S<sub>student</sub> = (Q × 0.5) + (A × 0.25) + (P × 0.15) + (S × 0.1)</div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-card border border-border rounded-lg p-4">
                              <div className="font-semibold text-foreground mb-2">Project Quality (Q) - 50%</div>
                              <div className="font-mono text-sm text-muted-foreground">
                                Q = Σ(project_scores) / project_count
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Rata-rata assessment semua project
                              </div>
                            </div>
                            
                            <div className="bg-card border border-border rounded-lg p-4">
                              <div className="font-semibold text-foreground mb-2">Activity Score (A) - 25%</div>
                              <div className="font-mono text-sm text-muted-foreground">
                                A = (project_count × 20) + (total_likes × 5)
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Produktivitas dan engagement
                              </div>
                            </div>
                            
                            <div className="bg-card border border-border rounded-lg p-4">
                              <div className="font-semibold text-foreground mb-2">Profile Score (P) - 15%</div>
                              <div className="font-mono text-sm text-muted-foreground">
                                P = Σ(profile_fields) × 20
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                5 field: bio, photo, github, linkedin, skills
                              </div>
                            </div>
                            
                            <div className="bg-card border border-border rounded-lg p-4">
                              <div className="font-semibold text-foreground mb-2">Social Score (S) - 10%</div>
                              <div className="font-mono text-sm text-muted-foreground">
                                S = (followers × 3) + (following × 1)
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Interaksi sosial dalam platform
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
            ),
        },
    ]

    return (
        <section className="bg-background py-20">
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <div className="flex flex-col gap-10 md:flex-row md:gap-16">
                    <div className="md:w-1/3">
                        <div className="sticky top-20">
                            <h2 className="mt-4 text-3xl font-bold text-foreground">Pertanyaan yang Sering Diajukan</h2>
                            <p className="text-muted-foreground mt-4">
                                Temukan jawaban atas pertanyaan umum tentang CodePacker Catalog dan fitur-fiturnya.
                            </p>
                        </div>
                    </div>
                    <div className="md:w-2/3">
                        <Accordion
                            type="single"
                            collapsible
                            className="w-full space-y-2">
                            {faqItems.map((item) => (
                                <AccordionItem
                                    key={item.id}
                                    value={item.id}
                                    className="bg-card border border-border rounded-lg px-4 shadow-sm hover:shadow-md transition-shadow">
                                    <AccordionTrigger className="cursor-pointer items-center py-5 hover:no-underline">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-6">
                                                <DynamicIcon
                                                    name={item.icon}
                                                    className="m-auto size-4 text-muted-foreground"
                                                />
                                            </div>
                                            <span className="text-base text-foreground">{item.question}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-5">
                                        <div className="px-9">
                                            <div className="text-base text-muted-foreground">{item.answer}</div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>
        </section>
    )
}
