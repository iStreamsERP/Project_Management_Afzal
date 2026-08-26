import { useEffect, type RefObject } from 'react'

export function useClickOutside(refs: RefObject<HTMLElement | null>[], callback: (event: MouseEvent) => void) {
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const isOutside = refs.every((ref) => !ref.current?.contains(event.target as Node))
      if (isOutside) callback(event)
    }

    window.addEventListener('mousedown', handleOutsideClick)
    return () => window.removeEventListener('mousedown', handleOutsideClick)
  }, [refs, callback])
}
