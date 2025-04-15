"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"

interface FadeProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
  direction?: "up" | "down" | "left" | "right" | "none"
  distance?: number
  once?: boolean
}

export const Fade: React.FC<FadeProps> = ({
  children,
  delay = 0,
  duration = 500,
  className = "",
  direction = "none",
  distance = 50,
  once = true,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const domRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once && domRef.current) {
            observer.unobserve(domRef.current)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      })
    })

    const currentRef = domRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [once])

  let transform = "translate3d(0, 0, 0)"
  if (direction === "up") transform = `translate3d(0, ${distance}px, 0)`
  if (direction === "down") transform = `translate3d(0, -${distance}px, 0)`
  if (direction === "left") transform = `translate3d(${distance}px, 0, 0)`
  if (direction === "right") transform = `translate3d(-${distance}px, 0, 0)`

  const style = {
    opacity: 0,
    transform,
    transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
    transitionDelay: `${delay}ms`,
  }

  const visibleStyle = {
    opacity: 1,
    transform: "translate3d(0, 0, 0)",
  }

  return (
    <div
      ref={domRef}
      className={className}
      style={{
        ...style,
        ...(isVisible ? visibleStyle : {}),
      }}
    >
      {children}
    </div>
  )
}

interface ScaleProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
  scale?: number
}

export const Scale: React.FC<ScaleProps> = ({ children, delay = 0, duration = 500, className = "", scale = 0.5 }) => {
  const [isVisible, setIsVisible] = useState(false)
  const domRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (domRef.current) {
            observer.unobserve(domRef.current)
          }
        }
      })
    })

    const currentRef = domRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  const style = {
    opacity: 0,
    transform: `scale(${scale})`,
    transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
    transitionDelay: `${delay}ms`,
  }

  const visibleStyle = {
    opacity: 1,
    transform: "scale(1)",
  }

  return (
    <div
      ref={domRef}
      className={className}
      style={{
        ...style,
        ...(isVisible ? visibleStyle : {}),
      }}
    >
      {children}
    </div>
  )
}

interface AnimatePresenceProps {
  children: React.ReactNode
  show: boolean
  duration?: number
}

export const AnimatePresence: React.FC<AnimatePresenceProps> = ({ children, show, duration = 300 }) => {
  const [shouldRender, setShouldRender] = useState(show)

  useEffect(() => {
    if (show) setShouldRender(true)
    else {
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [show, duration])

  const style = {
    opacity: show ? 1 : 0,
    height: show ? "auto" : 0,
    overflow: "hidden",
    transition: `opacity ${duration}ms ease-out, height ${duration}ms ease-out`,
  }

  return shouldRender ? <div style={style}>{children}</div> : null
}
