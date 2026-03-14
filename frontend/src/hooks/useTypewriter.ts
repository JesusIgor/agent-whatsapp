import { useState, useEffect, useCallback } from 'react'

interface UseTypewriterOptions {
  texts: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseBeforeDelete?: number
  pauseBeforeNext?: number
}

interface UseTypewriterReturn {
  displayText: string
  isTyping: boolean
  isDeleting: boolean
  currentIndex: number
}

export function useTypewriter({
  texts,
  typingSpeed = 50,
  deletingSpeed = 30,
  pauseBeforeDelete = 2000,
  pauseBeforeNext = 500,
}: UseTypewriterOptions): UseTypewriterReturn {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const currentText = texts[currentIndex] || ''

  useEffect(() => {
    if (texts.length === 0) return

    let timeout: NodeJS.Timeout

    if (isPaused) {
      timeout = setTimeout(() => {
        setIsPaused(false)
        if (isDeleting) {
          setIsTyping(false)
        } else {
          setIsDeleting(true)
        }
      }, isDeleting ? pauseBeforeNext : pauseBeforeDelete)
      return () => clearTimeout(timeout)
    }

    if (isTyping && !isDeleting) {
      if (displayText.length < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1))
        }, typingSpeed)
      } else {
        setIsPaused(true)
      }
    } else if (isDeleting) {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, deletingSpeed)
      } else {
        setIsDeleting(false)
        setIsTyping(true)
        setCurrentIndex((prev) => (prev + 1) % texts.length)
        setIsPaused(true)
      }
    }

    return () => clearTimeout(timeout)
  }, [
    displayText,
    currentText,
    currentIndex,
    isTyping,
    isDeleting,
    isPaused,
    texts,
    typingSpeed,
    deletingSpeed,
    pauseBeforeDelete,
    pauseBeforeNext,
  ])

  return {
    displayText,
    isTyping,
    isDeleting,
    currentIndex,
  }
}
