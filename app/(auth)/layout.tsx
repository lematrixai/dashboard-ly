import { AuthErrorBoundary } from "@/components/auth-error-boundary"
import { AuthProvider } from "@/context/auth-context"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
    <AuthErrorBoundary>
      {children}
    </AuthErrorBoundary>
    </AuthProvider>
  )
} 