import React from 'react'

interface ToastProps {
  mainMessage: string
  description?: string
}

const ToastMessage: React.FC<ToastProps> = ({ mainMessage, description }) => {
  return (
    <div>
      <strong>{mainMessage}</strong>
      <br />
      {description}
    </div>
  )
}

export default ToastMessage
