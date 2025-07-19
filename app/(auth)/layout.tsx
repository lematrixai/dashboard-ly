import { AuthErrorBoundary } from "@/components/auth-error-boundary"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthErrorBoundary>
      {children}
    </AuthErrorBoundary>
  )
} 