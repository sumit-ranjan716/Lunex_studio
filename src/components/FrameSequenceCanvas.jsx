import { useCallback, useEffect, useRef, useState } from "react"

const FRAME_COUNT = 50
const FRAME_RATE = 24

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function buildFrameSrc(index) {
  const frameNumber = String(index + 1).padStart(3, "0")
  return `/frames/ffout${frameNumber}.gif`
}

export default function FrameSequenceCanvas({ mode = "scroll", frameCount = FRAME_COUNT, sectionRef }) {
  const canvasRef = useRef(null)
  const framesRef = useRef([])
  const validFramesRef = useRef([])
  const rafRef = useRef(0)
  const autoplayRef = useRef(0)
  const lastTsRef = useRef(0)

  const [loadedCount, setLoadedCount] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [overlayVisible, setOverlayVisible] = useState(true)
  const [frameIndex, setFrameIndex] = useState(0)

  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const dpr = window.devicePixelRatio || 1

    // Resize backing store for crisp rendering on high-DPI displays.
    const targetW = Math.round(width * dpr)
    const targetH = Math.round(height * dpr)
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW
      canvas.height = targetH
    }

    const frames = validFramesRef.current.length ? validFramesRef.current : framesRef.current
    const image = frames[index] || frames.find(Boolean)

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (!image || !image.naturalWidth || !image.naturalHeight) {
      return
    }

    // Object-fit: cover equivalent for canvas.
    const scale = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight)
    const drawW = image.naturalWidth * scale
    const drawH = image.naturalHeight * scale
    const dx = (canvas.width - drawW) / 2
    const dy = (canvas.height - drawH) / 2

    ctx.drawImage(image, dx, dy, drawW, drawH)
  }, [])

  const scheduleDraw = useCallback((nextIndex) => {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => drawFrame(nextIndex))
  }, [drawFrame])

  useEffect(() => {
    let isCancelled = false
    const sources = Array.from({ length: frameCount }, (_, idx) => buildFrameSrc(idx))

    // Preload all frames in parallel and track progress.
    Promise.all(
      sources.map((src, idx) => {
        return new Promise((resolve) => {
          const img = new Image()
          img.decoding = "async"
          img.onload = () => {
            if (!isCancelled && img.naturalWidth > 0 && img.naturalHeight > 0) {
              framesRef.current[idx] = img
            }
            if (!isCancelled) setLoadedCount((count) => count + 1)
            resolve()
          }
          img.onerror = () => {
            if (!isCancelled) setLoadedCount((count) => count + 1)
            resolve()
          }
          img.src = src
        })
      })
    ).then(() => {
      if (isCancelled) return

      // Keep only valid image objects so drawing never targets broken frames.
      validFramesRef.current = framesRef.current.map((img) => img || null)
      setIsLoaded(true)
      setFrameIndex(0)
      scheduleDraw(0)

      // Smoothly fade loading UI after all frames resolve.
      window.setTimeout(() => setOverlayVisible(false), 180)
    })

    return () => {
      isCancelled = true
      cancelAnimationFrame(rafRef.current)
      cancelAnimationFrame(autoplayRef.current)
    }
  }, [frameCount, scheduleDraw])

  useEffect(() => {
    if (!isLoaded) return

    const handleResize = () => scheduleDraw(frameIndex)
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [frameIndex, isLoaded, scheduleDraw])

  useEffect(() => {
    if (!isLoaded || mode !== "scroll") return

    let ticking = false

    const updateFromScroll = () => {
      ticking = false

      const section = sectionRef?.current
      if (!section) return

      const rect = section.getBoundingClientRect()
      const viewportH = window.innerHeight || 1

      // 0 -> initial load, 1 -> when hero has scrolled 60% out of viewport.
      const progress = clamp(-rect.top / (viewportH * 0.6), 0, 1)
      const nextIndex = Math.round(progress * (frameCount - 1))

      setFrameIndex((prev) => {
        if (prev === nextIndex) return prev
        scheduleDraw(nextIndex)
        return nextIndex
      })
    }

    const requestTick = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(updateFromScroll)
    }

    requestTick()
    window.addEventListener("scroll", requestTick, { passive: true })
    window.addEventListener("resize", requestTick, { passive: true })

    return () => {
      window.removeEventListener("scroll", requestTick)
      window.removeEventListener("resize", requestTick)
    }
  }, [frameCount, isLoaded, mode, scheduleDraw, sectionRef])

  useEffect(() => {
    if (!isLoaded || mode !== "autoplay") return

    const frameDuration = 1000 / FRAME_RATE

    const loop = (timestamp) => {
      if (!lastTsRef.current) lastTsRef.current = timestamp
      const elapsed = timestamp - lastTsRef.current

      if (elapsed >= frameDuration) {
        lastTsRef.current = timestamp

        setFrameIndex((prev) => {
          const next = (prev + 1) % frameCount
          scheduleDraw(next)
          return next
        })
      }

      autoplayRef.current = requestAnimationFrame(loop)
    }

    autoplayRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(autoplayRef.current)
      lastTsRef.current = 0
    }
  }, [frameCount, isLoaded, mode, scheduleDraw])

  const progress = Math.round((loadedCount / frameCount) * 100)

  return (
    <div className="frame-sequence-canvas-wrap" aria-hidden="true">
      <canvas ref={canvasRef} className="frame-sequence-canvas" />

      <div className={`frame-loader ${overlayVisible ? "is-visible" : "is-hidden"}`}>
        <div className="frame-loader-bar" style={{ width: `${clamp(progress, 0, 100)}%` }} />
        <span className="frame-loader-text">{clamp(progress, 0, 100)}%</span>
      </div>
    </div>
  )
}
