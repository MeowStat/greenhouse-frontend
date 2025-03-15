import { useState, useCallback, useEffect } from 'react'

interface UseModalProps {
  onClose?: () => void
  closeOnEsc?: boolean
  closeOnBackdrop?: boolean
}

export function useModal({
  onClose,
  closeOnEsc = true,
  closeOnBackdrop = true,
}: UseModalProps = {}) {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    onClose?.()
  }, [onClose])

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  useEffect(() => {
    if (!closeOnEsc) return

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen, close, closeOnEsc])

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent) => {
      if (closeOnBackdrop && event.target === event.currentTarget) {
        close()
      }
    },
    [close, closeOnBackdrop],
  )

  return {
    isOpen,
    open,
    close,
    toggle,
    handleBackdropClick,
  }
}
