import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import React, { useRef } from 'react'

gsap.registerPlugin(useGSAP)

const App = () => {
  const boxRef = useRef(null)
  const leftWingRef = useRef(null)
  const rightWingRef = useRef(null)
  const flapTimelineRef = useRef(null)
  const flapStopCallRef = useRef(null)

  useGSAP(() => {
    // No initial animation; interactions happen on click
  }, [])

  const flyToRandomPosition = () => {
    const element = boxRef.current
    if (!element) return

    const elementWidth = element.offsetWidth || 100
    const elementHeight = element.offsetHeight || 100

    const maxX = window.innerWidth / 2 - elementWidth / 2
    const maxY = window.innerHeight / 2 - elementHeight / 2

    const x = gsap.utils.random(-maxX, maxX, 1)
    const y = gsap.utils.random(-maxY, maxY, 1)

    gsap.to(element, {
      x,
      y,
      duration: gsap.utils.random(0.6, 1.2),
      ease: 'power3.out'
    })
  }

  const resetWings = () => {
    if (!leftWingRef.current || !rightWingRef.current) return
    gsap.to([leftWingRef.current, rightWingRef.current], {
      rotation: 0,
      duration: 0.12,
      ease: 'power1.out',
      transformOrigin: (i) => (i === 0 ? '100% 50%' : '0% 50%'),
      transformBox: 'fill-box'
    })
  }

  const flapWings = () => {
    if (!leftWingRef.current || !rightWingRef.current) return
    if (flapTimelineRef.current) {
      flapTimelineRef.current.kill()
      flapTimelineRef.current = null
    }
    if (flapStopCallRef.current) {
      flapStopCallRef.current.kill()
      flapStopCallRef.current = null
    }

    // Ensure a consistent starting orientation and correct pivot at inner edge of each wing
    gsap.set([leftWingRef.current, rightWingRef.current], {
      rotation: 0,
      transformBox: 'fill-box',
      transformOrigin: (i) => (i === 0 ? '100% 50%' : '0% 50%')
    })

    const tl = gsap.timeline({ repeat: -1, yoyo: true })
    tl.to(leftWingRef.current, {
      rotation: -25,
      duration: 0.05,
      ease: 'sine.inOut',
      transformBox: 'fill-box',
      transformOrigin: '100% 50%'
    }, 0)
      .to(rightWingRef.current, {
        rotation: 25,
        duration: 0.05,
        ease: 'sine.inOut',
        transformBox: 'fill-box',
        transformOrigin: '0% 50%'
      }, 0)

    flapTimelineRef.current = tl

    flapStopCallRef.current = gsap.delayedCall(1.5, () => {
      if (flapTimelineRef.current) {
        flapTimelineRef.current.kill()
        flapTimelineRef.current = null
      }
      resetWings()
      flapStopCallRef.current = null
    })
  }

  const handleClick = () => {
    flapWings()
    flyToRandomPosition()
  }
  return (
    <main>
      <div className='box' ref={boxRef} onMouseEnter={handleClick}>
        <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(60,60)">
            <g ref={leftWingRef}>
              <ellipse cx="-20" cy="0" rx="20" ry="14" fill="rgba(255,255,255,0.85)" />
            </g>
            <g ref={rightWingRef}>
              <ellipse cx="20" cy="0" rx="20" ry="14" fill="rgba(255,255,255,0.85)" />
            </g>
            <ellipse cx="0" cy="8" rx="12" ry="18" fill="#2b2b2b" />
            <circle cx="-5" cy="-6" r="6" fill="#1e1e1e" />
            <circle cx="5" cy="-6" r="6" fill="#1e1e1e" />
          </g>
        </svg>
      </div>
      <div className='button'>
        <p>catch me if you can</p>
      </div>
    </main>
  )
}

export default App
