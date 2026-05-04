import { useRef } from "react"
import FrameSequenceCanvas from "@/components/FrameSequenceCanvas.jsx"

export default function HeroSection({ mode = "scroll" }) {
  const heroRef = useRef(null)

  return (
    <section id="hero" className="frame-hero" ref={heroRef}>
      <FrameSequenceCanvas mode={mode} sectionRef={heroRef} />

      <div className="frame-hero-overlay-left" aria-hidden="true" />
      <div className="frame-hero-overlay-bottom" aria-hidden="true" />

      <div className="frame-hero-content">
        <span className="hero-tag">Lunex Studio</span>

        <h1 className="hero-title">
          <span>WE BUILD</span>
          <span>DIGITAL PRODUCTS</span>
          <span className="hero-title-accent">THAT LAUNCH.</span>
        </h1>

        <p className="hero-sub">
          Landing pages, full-stack web apps and mobile applications engineered with precision,
          speed, and intent.
        </p>

        <div className="hero-actions">
          <a href="#contact" className="btn-red">Start a Project</a>
          <a href="#work" className="btn-outline">View Case Studies</a>
        </div>
      </div>

      <div className="hero-scroll-hint" aria-hidden="true">
        <span className="hero-scroll-line" />
        <span className="hero-scroll-text">SCROLL</span>
      </div>
    </section>
  )
}
