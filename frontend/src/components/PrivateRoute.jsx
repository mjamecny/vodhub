import { Routes, Route } from 'react-router-dom'
import { useAuthUser, useIsAuthenticated } from 'react-auth-kit'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children, role }) => {
  const auth = useAuthUser()
  const isAuthenticated = useIsAuthenticated()

  return auth()?.role === role ? <>{children}</> : <Navigate to="/" />
}

export default PrivateRoute
