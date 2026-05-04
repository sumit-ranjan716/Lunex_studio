import * as React from "react"

// Mobile breakpoint matching Tailwind's md breakpoint
const MOBILE_BREAKPOINT = 768

/**
 * Hook to detect mobile viewport.
 * Handles hydration mismatch by initializing with actual viewport size.
 * Prevents listener accumulation with proper cleanup.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // SSR safe: check window exists before accessing innerWidth
    if (typeof window === "undefined") return false
    return window.innerWidth < MOBILE_BREAKPOINT
  })

  React.useEffect(() => {
    // Create single matchMedia query (memoized in closure)
    const mediaQuery = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
    )

    // Handler updates state when media query changes
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }

    // Attach listener
    mediaQuery.addEventListener("change", handleChange)

    // Sync initial state in case viewport changed since useState init
    setIsMobile(mediaQuery.matches)

    // Cleanup: remove listener to prevent accumulation
    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, []) // Empty deps: effect runs once only

  return isMobile
}
