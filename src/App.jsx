import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Navbar from './components/Navbar'

// shared
import Login from './pages/Login'


// admin
import AdminDashboard from './pages/AdminDashboard'
import AdminTournamentDetails from './pages/AdminTournamentDetails'
import AdminRoute from './routes/AdminRoute'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    localStorage.removeItem('user')
    setUser(null)
    setIsLoggedIn(false)
  }, [])

  return (
    <BrowserRouter>

      {/* NAVBAR */}
      {isLoggedIn && (
        <Navbar
          user={user}
          setUser={setUser}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}

      <div className="main-content">
        <Routes>

          {/* ===== PUBLIC ===== */}
          <Route
            path="/"
            element={
              isLoggedIn
                ? <Navigate to="/admin" />
                : <Login setUser={setUser} setIsLoggedIn={setIsLoggedIn} />
            }
          />

         

          <Route
            path="/profile"
            element={
              isLoggedIn
                ? <Profile user={user} />
                : <Navigate to="/" />
            }
          />

          {/* ===== ADMIN ROUTES ===== */}
          <Route
            path="/admin"
            element={<AdminRoute user={user} isLoggedIn={isLoggedIn} />}
          >
            <Route index element={<AdminDashboard />} />
            <Route path="tournaments/:id" element={<AdminTournamentDetails />} />
          </Route>

          {/* ===== FALLBACK ===== */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </div>

    </BrowserRouter>
  )
}

export default App
