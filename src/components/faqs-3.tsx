'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'
import Link from 'next/link'

type FAQItem = {
    id: string
    icon: IconName
    question: string
    answer: string
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
    ]

    return (
        <section className="bg-muted dark:bg-background py-20">
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <div className="flex flex-col gap-10 md:flex-row md:gap-16">
                    <div className="md:w-1/3">
                        <div className="sticky top-20">
                            <h2 className="mt-4 text-3xl font-bold">Pertanyaan yang Sering Diajukan</h2>
                            <p className="text-muted-foreground mt-4">
                                Tidak menemukan yang Anda cari? Hubungi{' '}
                                <Link
                                    href="#"
                                    className="text-primary font-medium hover:underline">
                                    tim admin kami
                                </Link>
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
                                    className="bg-background shadow-xs rounded-lg border px-4 last:border-b">
                                    <AccordionTrigger className="cursor-pointer items-center py-5 hover:no-underline">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-6">
                                                <DynamicIcon
                                                    name={item.icon}
                                                    className="m-auto size-4"
                                                />
                                            </div>
                                            <span className="text-base">{item.question}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-5">
                                        <div className="px-9">
                                            <p className="text-base">{item.answer}</p>
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
