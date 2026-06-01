import { useState, useEffect } from 'react'

export function useDarkMode() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('sd-dark-mode')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('sd-dark-mode', JSON.stringify(dark))
  }, [dark])

  return [dark, setDark]
}
