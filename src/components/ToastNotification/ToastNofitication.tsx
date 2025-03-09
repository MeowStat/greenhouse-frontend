import { Toaster } from "react-hot-toast"

const ToastNofitication = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          padding: '24px 16px',
          color: '#333',
        },

        success: {
          style: {
            background: "#b4e8c5", 
          },
          iconTheme: {
            primary: "#086e31",
            secondary: "#fff",
          }
        },

        error: {
          style: {
            background: "#f8d7da", 
          },
          iconTheme: {
            primary: "#d9534f",
            secondary: "#fff",
          }
        }
      }}
    />
  )
}

export default ToastNofitication