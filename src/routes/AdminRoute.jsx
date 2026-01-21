import { Navigate, Outlet } from 'react-router-dom'

function AdminRoute({ user, isLoggedIn }) {
  if (!isLoggedIn) return <Navigate to="/" />
  if (user?.role !== 'admin') return <Navigate to="/dashboard" />
  return <Outlet />
}

export default AdminRoute
