'use client'

import React from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ModeToggle } from '@/components/mode-toggle'
import { isStudentLoggedIn, getStudentInfo } from '@/lib/session'

const menuItems = [
    { name: 'Siswa', href: '/siswa' },
    { name: 'Project', href: '/projects' },
]

interface GuestNavbarProps {
    className?: string
}

export const GuestNavbar = ({ className }: GuestNavbarProps) => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const [studentLoggedIn, setStudentLoggedIn] = React.useState(false)
    const [studentInfo, setStudentInfo] = React.useState<{ name: string; email: string } | null>(null)
    
    console.log('=== GuestNavbar Component Render ===')
    console.log('Current studentLoggedIn state:', studentLoggedIn)
    console.log('Current studentInfo state:', studentInfo)

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
            console.log('=== Navbar: Checking login status ===')
            const loggedIn = isStudentLoggedIn()
            console.log('Navbar: isStudentLoggedIn result:', loggedIn)
            setStudentLoggedIn(loggedIn)
            if (loggedIn) {
                const info = getStudentInfo()
                console.log('Navbar: Student info:', info)
                setStudentInfo(info)
            } else {
                setStudentInfo(null)
            }
            console.log('Navbar: State updated - studentLoggedIn:', loggedIn)
        }

        // Initial check
        console.log('Navbar: Running initial login check')
        checkLoginStatus()

        // Listen for storage changes (when user logs in/out in another tab)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'codepacker_student_session') {
                console.log('Navbar: Storage changed, rechecking login status')
                checkLoginStatus()
            }
        }

        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [])

    return (
        <header className={className}>
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