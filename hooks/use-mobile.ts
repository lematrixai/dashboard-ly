"use client"

import { useEffect, useState } from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Check on mount
    checkIsMobile()

    // Add event listener
    window.addEventListener("resize", checkIsMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  // Return false during SSR to prevent hydration mismatch
  return isMobile ?? false
}
