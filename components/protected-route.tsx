"use client"

import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('ProtectedRoute: loading =', loading, 'user =', user ? user.email : 'null');
    
    if (!loading && !user) {
      console.log('User not authenticated, redirecting to sign-in...');
      router.push('/sign-in');
    }
  }, [loading, user, router]);

  // Show loading state while checking authentication
  if (loading) {
    console.log('ProtectedRoute: Showing loading state');
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading state while redirecting (when user is null but not loading)
  if (!user) {
    console.log('ProtectedRoute: User not authenticated, showing redirect state');
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Redirecting to sign-in...</p>
        </div>
      </div>
    );
  }

  console.log('ProtectedRoute: User authenticated, rendering children');
  return <>{children}</>;
} 