import { useEffect } from 'react'

const FinisherBackground = () => {
  useEffect(() => {
    const scriptId = 'finisher-header-script'
    let script = document.getElementById(scriptId) as HTMLScriptElement | null

    // Remove existing script to ensure proper reloading
    if (script) {
      script.remove()
    }

    script = document.createElement('script')
    script.id = scriptId
    script.src = '/finisher-header.es5.min.js'
    script.async = true
    script.onload = () => {
      if ((window as any).FinisherHeader) {
        new (window as any).FinisherHeader({
          count: 30,
          size: { min: 10, max: 50, pulse: 0 },
          speed: { x: { min: 0, max: 0.8 }, y: { min: 0, max: 0.3 } },
          colors: {
            background: '#fffcd6',
            particles: ['#086e31', '#b4e8c5', '#48ab69'],
          },
          blending: 'screen',
          opacity: { center: 1, edge: 1 },
          skew: 0,
          shapes: ['c', 's', 't'],
        })
      }
    }

    document.body.appendChild(script)

    return () => {
      script?.remove()
    }
  }, [])

  return (
    <div
      className="finisher-header fixed inset-0 w-full h-full"
      style={{ zIndex: -10 }} // Lowered z-index to avoid overlapping
    />
  )
}

export default FinisherBackground
