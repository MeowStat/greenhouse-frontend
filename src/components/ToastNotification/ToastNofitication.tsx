import { Toaster } from "react-hot-toast"

const ToastNofitication = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          width: "15vw",
          padding: '16px 8px',
          color: '#333',
          textAlign: 'left',
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