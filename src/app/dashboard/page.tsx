"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession, signOut } from "@/lib/auth-client";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CP</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Welcome, {session.user.name || session.user.email}
              </span>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                disabled={isSigningOut}
              >
                {isSigningOut ? "Signing out..." : "Sign Out"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to CodePacker Catalog
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            This is your dashboard. Authentication is working successfully!
          </p>
        </div>

        {/* User Info Card */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="font-medium">Email:</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">{session.user.email}</p>
              </div>
              <div>
                <span className="font-medium">Name:</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {session.user.name || "Not set"}
                </p>
              </div>
              <div>
                <span className="font-medium">Role:</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {(session.user as any).role || "student"}
                </p>
              </div>
              <div>
                <span className="font-medium">User ID:</span>
                <p className="text-xs text-gray-500 dark:text-gray-500 font-mono">
                  {session.user.id}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session Info</CardTitle>
              <CardDescription>Current session details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="font-medium">Session ID:</span>
                <p className="text-xs text-gray-500 dark:text-gray-500 font-mono">
                  {session.session.id}
                </p>
              </div>
              <div>
                <span className="font-medium">Expires At:</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(session.session.expiresAt).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>What would you like to do?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline" disabled>
                View Profile (Coming Soon)
              </Button>
              <Button className="w-full" variant="outline" disabled>
                My Projects (Coming Soon)
              </Button>
              <Button className="w-full" variant="outline" disabled>
                Settings (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Success Message */}
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-green-800 dark:text-green-400">
              🎉 Authentication Setup Complete!
            </CardTitle>
            <CardDescription className="text-green-700 dark:text-green-300">
              Better Auth is working correctly with your database integration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
              <p>✅ User registration and login working</p>
              <p>✅ Session management active</p>
              <p>✅ Database integration successful</p>
              <p>✅ Protected routes functioning</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}