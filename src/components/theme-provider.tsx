/**
 * Theme Provider: Manages dark/light/system theme with localStorage sync,
 * keyboard shortcuts (D key), cross-tab sync, and smooth transitions.
 * eslint-disable: exports are intentional for context provider pattern
 */
/* eslint-disable react-refresh/only-export-components */
import * as React from "react"

type Theme = "dark" | "light" | "system"
type ResolvedTheme = "dark" | "light"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  disableTransitionOnChange?: boolean
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)"
const THEME_VALUES: Theme[] = ["dark", "light", "system"]

const ThemeProviderContext = React.createContext<
  ThemeProviderState | undefined
>(undefined)

/**
 * TYPE GUARD: Validates if value is a valid Theme.
 * Used to sanitize localStorage and cross-tab storage events.
 */
function isTheme(value: string | null): value is Theme {
  if (value === null) {
    return false
  }

  return THEME_VALUES.includes(value as Theme)
}

/**
 * SYSTEM THEME: Get OS preference for dark/light mode.
 */
function getSystemTheme(): ResolvedTheme {
  if (window.matchMedia(COLOR_SCHEME_QUERY).matches) {
    return "dark"
  }

  return "light"
}

/**
 * TRANSITION MANAGER: Disables CSS transitions during theme switch.
 * Prevents jarring color flash by batching DOM updates.
 */
function disableTransitionsTemporarily() {
  const style = document.createElement("style")
  // Use textContent for cleaner, more direct style injection
  style.textContent =
    "*,*::before,*::after{-webkit-transition:none!important;transition:none!important}"
  document.head.appendChild(style)

  return () => {
    // Force style recalc to apply transition disable
    window.getComputedStyle(document.body)
    // Remove style after two animation frames to restore transitions
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        style.remove()
      })
    })
  }
}

/**
 * EDITABLE CHECK: Prevent theme toggle when user is typing.
 * Detects contenteditable and form input elements.
 */
function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  // Direct contenteditable attribute
  if (target.isContentEditable) {
    return true
  }

  // Inside form elements
  const editableParent = target.closest(
    "input, textarea, select, [contenteditable='true']"
  )
  return !!editableParent
}

/**
 * PROVIDER: Root component for theme management.
 * Manages localStorage persistence, keyboard shortcuts (D key),
 * cross-tab sync, and OS preference changes.
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  disableTransitionOnChange = true,
  ...props
}: ThemeProviderProps) {
  // STATE: Current theme from storage or default
  const [theme, setThemeState] = React.useState<Theme>(() => {
    const storedTheme = localStorage.getItem(storageKey)
    return isTheme(storedTheme) ? storedTheme : defaultTheme
  })

  /**
   * PERSIST: Save theme to localStorage and state.
   * Memoized to prevent unnecessary callback recreation.
   */
  const setTheme = React.useCallback(
    (nextTheme: Theme) => {
      localStorage.setItem(storageKey, nextTheme)
      setThemeState(nextTheme)
    },
    [storageKey]
  )

  /**
   * APPLY: Update DOM class and manage transitions.
   * Called whenever theme changes (including system pref change).
   */
  const applyTheme = React.useCallback(
    (nextTheme: Theme) => {
      const root = document.documentElement
      // RESOLVE: Convert "system" to actual "dark" or "light"
      const resolvedTheme =
        nextTheme === "system" ? getSystemTheme() : nextTheme
      // TRANSITION: Optionally disable flashing during theme switch
      const restoreTransitions = disableTransitionOnChange
        ? disableTransitionsTemporarily()
        : null

      // UPDATE: Apply theme class to root element
      root.classList.remove("light", "dark")
      root.classList.add(resolvedTheme)

      // CLEANUP: Re-enable transitions
      if (restoreTransitions) {
        restoreTransitions()
      }
    },
    [disableTransitionOnChange]
  )

  /**
   * HELPER: Compute next theme in cycle (dark → light → dark)
   * Replaces complex nested ternary with readable function.
   */
  const getNextTheme = React.useCallback((currentTheme: Theme): Theme => {
    if (currentTheme === "dark") return "light"
    if (currentTheme === "light") return "dark"
    // For system: resolve and pick opposite
    const resolved = getSystemTheme()
    return resolved === "dark" ? "light" : "dark"
  }, [])

  /**
   * EFFECT 1: Apply theme when state changes or system pref changes.
   * Listens to OS dark mode toggle if theme is "system".
   */
  React.useEffect(() => {
    applyTheme(theme)

    // SKIP: If theme is explicit (not system), no need to watch OS
    if (theme !== "system") {
      return undefined
    }

    // WATCH: OS preference changes
    const mediaQuery = window.matchMedia(COLOR_SCHEME_QUERY)
    const handleChange = () => {
      applyTheme("system")
    }

    mediaQuery.addEventListener("change", handleChange)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [theme, applyTheme])

  /**
   * EFFECT 2: Global keyboard shortcut (D key) to toggle theme.
   * Prevents toggle when user is typing in inputs.
   */
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // IGNORE: Repeated key presses (held down)
      if (event.repeat) {
        return
      }

      // IGNORE: Modifier keys (Ctrl, Alt, Cmd)
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      // IGNORE: User is typing in input/textarea/contenteditable
      if (isEditableTarget(event.target)) {
        return
      }

      // TRIGGER: Only on 'd' key (case-insensitive)
      if (event.key.toLowerCase() !== "d") {
        return
      }

      // ACTION: Toggle theme using helper function
      setThemeState((currentTheme) => {
        const nextTheme = getNextTheme(currentTheme)
        // PERSIST: Also save to localStorage
        localStorage.setItem(storageKey, nextTheme)
        return nextTheme
      })
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [storageKey, getNextTheme])

  /**
   * EFFECT 3: Sync theme across browser tabs.
   * Updates this tab if another tab changes the theme.
   */
  React.useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      // VALIDATE: Check it's localStorage (not sessionStorage)
      if (event.storageArea !== localStorage) {
        return
      }

      // VALIDATE: Check the right key was changed
      if (event.key !== storageKey) {
        return
      }

      // UPDATE: If new value is valid theme, use it
      if (isTheme(event.newValue)) {
        setThemeState(event.newValue)
        return
      }

      // FALLBACK: If theme was deleted in other tab, use default
      setThemeState(defaultTheme)
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [defaultTheme, storageKey])

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme, setTheme]
  )

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

/**
 * HOOK: Access current theme and setter.
 * Must be used within ThemeProvider.
 * @throws Error if used outside ThemeProvider
 */
export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error(
      "useTheme hook must be used within a <ThemeProvider> component. " +
        "Wrap your app root with: <ThemeProvider><YourApp /></ThemeProvider>"
    )
  }

  return context
}
