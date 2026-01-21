import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Navbar from './components/Navbar'

// shared
import Login from './pages/Login'

// player pages
import Dashboard from './pages/Dashboard'
import AllTournaments from './pages/AllTournaments'
import TournamentDetails from './pages/TournamentDetails'
import MyTournaments from './pages/MyTournaments'

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

      {isLoggedIn && (
        <Navbar
          user={user}
          setUser={setUser}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}

      <div className="main-content">
        <Routes>

          {/* LOGIN */}
          <Route
            path="/"
            element={
              isLoggedIn
                ? <Navigate to="/dashboard" />
                : <Login setUser={setUser} setIsLoggedIn={setIsLoggedIn} />
            }
          />

          {/* PLAYER */}
          <Route
            path="/dashboard"
            element={
              isLoggedIn
                ? <Dashboard user={user} />
                : <Navigate to="/" />
            }
          />

          <Route
            path="/tournaments"
            element={
              isLoggedIn
                ? <AllTournaments user={user} />
                : <Navigate to="/" />
            }
          />

          <Route
            path="/tournaments/:id"
            element={
              isLoggedIn
                ? <TournamentDetails user={user} />
                : <Navigate to="/" />
            }
          />

          <Route
            path="/mytournaments"
            element={
              isLoggedIn
                ? <MyTournaments user={user} />
                : <Navigate to="/" />
            }
          />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </div>

    </BrowserRouter>
  )
}

export default App
