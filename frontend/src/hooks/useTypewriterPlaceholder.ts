import { useState, useEffect, useMemo } from 'react'

export interface UseTypewriterPlaceholderOptions {
  placeholders: string[]
  disabled?: boolean
  isFocused?: boolean
  typingSpeed?: number
  rotationDelay?: number
}

export function useTypewriterPlaceholder({
  placeholders,
  disabled = false,
  isFocused = false,
  typingSpeed = 50,
  rotationDelay = 2500,
}: UseTypewriterPlaceholderOptions) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  const allPlaceholders = useMemo(() => placeholders, [placeholders])

  useEffect(() => {
    if (disabled) {
      setDisplayedPlaceholder('')
      return
    }

    const currentText = allPlaceholders[placeholderIndex]

    if (isFocused) {
      setDisplayedPlaceholder(currentText)
      setIsTyping(false)
      return
    }

    let currentIndex = 0
    setDisplayedPlaceholder('')
    setIsTyping(true)

    const typingInterval = setInterval(() => {
      if (currentIndex <= currentText.length) {
        setDisplayedPlaceholder(currentText.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(typingInterval)
        setIsTyping(false)
      }
    }, typingSpeed)

    return () => clearInterval(typingInterval)
  }, [placeholderIndex, isFocused, disabled, allPlaceholders, typingSpeed])

  useEffect(() => {
    if (isFocused || disabled || isTyping) return

    const timeout = setTimeout(() => {
      setPlaceholderIndex((prev) => (prev + 1) % allPlaceholders.length)
    }, rotationDelay)

    return () => clearTimeout(timeout)
  }, [placeholderIndex, isFocused, disabled, isTyping, allPlaceholders.length, rotationDelay])

  return {
    displayedPlaceholder,
    isTyping,
  }
}
