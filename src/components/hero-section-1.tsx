'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronRight, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { cn } from '@/lib/utils'
import { ModeToggle } from '@/components/mode-toggle'
import { isStudentLoggedIn, getStudentInfo } from '@/lib/session'


const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring' as const,
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden">
                <section className="min-h-screen flex items-center justify-center pt-16">
                    <div className="relative w-full">
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center">
                                <AnimatedGroup variants={transitionVariants}>
                                    {/* JHIC Logo - Organizer */}
                                    <div className="flex justify-center mb-6">
                                        <div className="flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg px-6 py-3 border">
                                            <img
                                                src="/images/jhic-logo.png"
                                                alt="JHIC Logo"
                                                className="h-12 w-auto"
                                            />
                                        </div>
                                    </div>
                                    <h1
                                        className="max-w-4xl mx-auto text-balance text-5xl md:text-6xl xl:text-[4.5rem] font-normal text-foreground">
                                        Katalog Project Siswa SMK Negeri 4 Malang
                                    </h1>
                                    <p
                                        className="mx-auto mt-8 max-w-2xl text-balance text-lg text-muted-foreground">
                                        Platform untuk menampilkan dan mengelola project-project kreatif siswa SMK Negeri 4 Malang. Temukan berbagai project inovatif dari siswa berbakat kami.
                                    </p>
                                </AnimatedGroup>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                                    <div
                                        key={1}
                                        className="bg-foreground/10 rounded-[14px] border p-0.5">
                                        <Button
                                            key={1}
                                            asChild
                                            size="lg"
                                            className="rounded-xl px-5 text-base">
                                            <Link href="/projects">
                                                <span className="text-nowrap">Jelajahi Project</span>
                                            </Link>
                                        </Button>
                                    </div>
                                    <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="h-10.5 rounded-xl px-5">
                                        <Link href="/login">
                                            <span className="text-nowrap">Login Siswa</span>
                                        </Link>
                                    </Button>
                                </AnimatedGroup>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

const menuItems = [
    { name: 'Siswa', href: '/siswa' },
    { name: 'Project', href: '/projects' },
]

const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const [studentLoggedIn, setStudentLoggedIn] = React.useState(false)
    const [studentInfo, setStudentInfo] = React.useState<{ name: string; email: string } | null>(null)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    React.useEffect(() => {
        // Check student login status on component mount and when localStorage changes
        const checkLoginStatus = () => {
            console.log('=== HeroHeader: Checking login status ===')
            const loggedIn = isStudentLoggedIn()
            console.log('HeroHeader: isStudentLoggedIn result:', loggedIn)
            console.log('HeroHeader: Current studentLoggedIn state before update:', studentLoggedIn)
            setStudentLoggedIn(loggedIn)
            if (loggedIn) {
                const info = getStudentInfo()
                console.log('HeroHeader: Student info:', info)
                setStudentInfo(info)
            } else {
                setStudentInfo(null)
            }
            console.log('HeroHeader: State updated - studentLoggedIn:', loggedIn)
            // Force a re-render by updating state in next tick
            setTimeout(() => {
                console.log('HeroHeader: Forcing re-render check, current state:', studentLoggedIn)
            }, 0)
        }

        // Initial check
        console.log('HeroHeader: Running initial login check')
        checkLoginStatus()

        // Listen for storage changes (when user logs in/out in another tab)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'codepacker_student_session') {
                console.log('HeroHeader: Storage changed, rechecking login status')
                checkLoginStatus()
            }
        }

        // Listen for custom events (when user logs in/out in same tab)
        const handleCustomEvent = () => {
            console.log('HeroHeader: Custom login event received, rechecking login status')
            checkLoginStatus()
        }

        window.addEventListener('storage', handleStorageChange)
        window.addEventListener('studentLoginChanged', handleCustomEvent)
        return () => {
            window.removeEventListener('storage', handleStorageChange)
            window.removeEventListener('studentLoginChanged', handleCustomEvent)
        }
    }, [])

    // Add effect to log state changes
    React.useEffect(() => {
        console.log('HeroHeader: studentLoggedIn state changed to:', studentLoggedIn)
        console.log('HeroHeader: studentInfo state:', studentInfo)
    }, [studentLoggedIn, studentInfo])
    
    // Debug log during render
    console.log('HeroHeader RENDER: studentLoggedIn =', studentLoggedIn, 'studentInfo =', studentInfo)
    
    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="fixed z-20 w-full px-2 group">
                <div className={cn('mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12', isScrolled && 'bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5')}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Logo />
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.href}
                                            className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                <ModeToggle />
                                {studentLoggedIn ? (
                                    // Show "Masuk ke App" button for logged-in students
                                    <>
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                            className={cn(isScrolled && 'lg:hidden')}>
                                            <Link href="/app">
                                                <span>Masuk ke App</span>
                                            </Link>
                                        </Button>
                                        <Button
                                            asChild
                                            size="sm"
                                            className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}>
                                            <Link href="/app">
                                                <span>Masuk ke App</span>
                                            </Link>
                                        </Button>
                                    </>
                                ) : (
                                    // Show "Login" button for non-logged-in users
                                    <>
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                            className={cn(isScrolled && 'lg:hidden')}>
                                            <Link href="/login">
                                                <span>Login</span>
                                            </Link>
                                        </Button>
                                        <Button
                                            asChild
                                            size="sm"
                                            className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}>
                                            <Link href="/login">
                                                <span>Login</span>
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

const Logo = ({ className }: { className?: string }) => {
    return (
        <div className="flex items-center">
            {/* Light theme logo (black) */}
            <img
                src="/images/logos/codepacker-black.svg"
                alt="CodePacker Logo"
                className={cn('h-8 w-auto dark:hidden', className)}
            />
            {/* Dark theme logo (white) */}
            <img
                src="/images/logos/codepacker-white.svg"
                alt="CodePacker Logo"
                className={cn('h-8 w-auto hidden dark:block', className)}
            />
        </div>
    )
}