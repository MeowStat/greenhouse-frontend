import { Navigate, Outlet, useLocation } from "react-router";
import useAuth from "../../hooks/useAuth"

const RequiredAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();

  if (auth === undefined) {
    return <div>Loading...</div>; 
  }

  return (
    auth?.token 
        ? <Outlet/>
        : <Navigate to="/login" state={{ from: location }} replace/>
  )
}

export default RequiredAuth