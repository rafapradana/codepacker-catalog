"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeftIcon, Loader2 } from "lucide-react";
import { FloatingPaths } from "@/components/floating-paths";
import { saveStudentSession } from '@/lib/session';

const loginSchema = z.object({
    email: z.string().email("Email tidak valid"),
    password: z.string().min(1, "Password harus diisi"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function StudentAuthPage() {
    const router = useRouter();
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState<string>("");

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleInputChange = (field: keyof LoginFormData) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
        if (loginError) {
            setLoginError("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        setLoginError("");

        const validationResult = loginSchema.safeParse(formData);

        if (!validationResult.success) {
            const formattedErrors = validationResult.error.flatten();
            setErrors({
                email: formattedErrors.fieldErrors.email?.[0],
                password: formattedErrors.fieldErrors.password?.[0],
            });
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/student-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(validationResult.data),
            });

            const result = await response.json();

            if (response.ok && result.user) {
                const sessionData = {
                    id: result.user.id,
                    email: result.user.email,
                    name: result.user.name,
                    studentId: result.user.studentId || '',
                    className: result.user.className || '',
                    profilePhotoUrl: result.user.profilePhotoUrl || '',
                    loginTime: new Date().toISOString()
                };
                saveStudentSession(sessionData);
                router.push('/app');
            } else {
                setLoginError(result.error || 'Login gagal. Periksa kembali email dan password Anda.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setLoginError('Terjadi kesalahan jaringan. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
            <div className="relative hidden h-full flex-col border-r bg-secondary p-10 lg:flex dark:bg-secondary/20">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
                {mounted && (
                    <Image
                        src={theme === "dark" ? "/images/logos/codepacker-white.svg" : "/images/logos/codepacker-black.svg"}
                        alt="CodePacker"
                        width={120}
                        height={40}
                        className="mr-auto h-8 w-auto"
                    />
                )}
                <div className="absolute inset-0">
                    <FloatingPaths position={1} />
                    <FloatingPaths position={-1} />
                </div>
            </div>
            <div className="relative flex min-h-screen flex-col justify-center p-4">
                <div
                    aria-hidden
                    className="-z-10 absolute inset-0 isolate opacity-60 contain-strict"
                >
                    <div className="-translate-y-87.5 absolute top-0 right-0 h-320 w-140 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)]" />
                    <div className="absolute top-0 right-0 h-320 w-60 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div className="-translate-y-87.5 absolute top-0 right-0 h-320 w-60 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)]" />
                </div>
                <Button asChild className="absolute top-7 left-5" variant="ghost">
                    <a href="/">
                        <ChevronLeftIcon />
                        Home
                    </a>
                </Button>
                <div className="mx-auto space-y-6 sm:w-sm">
                    {mounted && (
                        <Image
                            src={theme === "dark" ? "/images/logos/codepacker-white.svg" : "/images/logos/codepacker-black.svg"}
                            alt="CodePacker"
                            width={120}
                            height={40}
                            className="h-8 w-auto lg:hidden"
                        />
                    )}
                    <div className="flex flex-col space-y-2">
                        <h1 className="font-bold text-2xl tracking-tight">
                            Masuk ke Akun Siswa
                        </h1>
                    </div>

                    {loginError && (
                        <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-md p-3 text-sm">
                            {loginError}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                placeholder="nama@email.com"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange("email")}
                                className={errors.email ? "border-destructive" : ""}
                            />
                            {errors.email && (
                                <p className="text-destructive text-sm">{errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                placeholder="Masukkan password Anda"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange("password")}
                                className={errors.password ? "border-destructive" : ""}
                            />
                            {errors.password && (
                                <p className="text-destructive text-sm">{errors.password}</p>
                            )}
                        </div>

                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Masuk...
                                </>
                            ) : (
                                'Masuk'
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </main>
    );
}
