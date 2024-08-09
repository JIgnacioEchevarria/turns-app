import { Navigate } from 'react-router-dom'
import { useUserStore } from '../store/user'
import { ROLES } from '../constants/roles.js'

// Componente para proteger rutas en el frontend.
// Cuando no hay un accesstoken se rederige
export const ProtectedRoute = ({ children }) => {
  const userInfo = useUserStore(state => state.userInfo)

  if (!userInfo) return <Navigate to={'/login'} />

  return children
}

// Componente para proteger rutas en el frontend.
// Cuando no hay un accesstoken o el usuario no es admin se rederige
export const ProtectedRouteAdmin = ({ children }) => {
  const userInfo = useUserStore(state => state.userInfo)

  if (!userInfo) return <Navigate to={'/login'} />
  if (userInfo.role !== ROLES.ADMIN) return <Navigate to={'/'} />

  return children
}

export const ProtectedRouteAdminOrEmployee = ({ children }) => {
  const userInfo = useUserStore(state => state.userInfo)

  if (!userInfo) return <Navigate to={'/login'} />
  if (userInfo.role === ROLES.CLIENT) return <Navigate to={'/'} />

  return children
}
