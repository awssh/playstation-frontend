import { Link, useNavigate } from 'react-router-dom'
import '../style/sidebar.css'

function Navbar({ user, setUser, setIsLoggedIn }) {
  const navigate = useNavigate()

  const handleLogout = () => {
      localStorage.removeItem("user")   

    setUser(null)
    setIsLoggedIn(false)
    navigate('/')
  }

  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        🎮 <span>PlayStation</span>
      </div>

      <nav className="sidebar-menu">
        {user?.role === 'admin' ? (
          <>
            <Link to="/admin">📊 Dashboard</Link>
            <Link to="/tournaments">📋 All Tournaments</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard">📊 Dashboard</Link>
            <Link to="/tournaments">📋 All Tournaments</Link>
            <Link to="/mytournaments">🏆 My Tournaments</Link>
            <Link to="/profile">👤 Profile</Link>
          </>
        )}
      </nav>

      <button className="logout" onClick={handleLogout}>
        🚪 Logout
      </button>

    </aside>
  )
}

export default Navbar
