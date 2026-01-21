import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Navbar from './components/Navbar'

import Login from './pages/Login'
import SignUp from './pages/signup'
import Dashboard from './pages/Dashboard'
import AllTournaments from './pages/AllTournaments'
import TournamentDetails from './pages/TournamentDetails'
import MyTournaments from './pages/MyTournaments'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import AdminTournamentDetails from './pages/AdminTournamentDetails'

import AdminRoute from './routes/AdminRoute'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
useEffect(() => {
  localStorage.removeItem("user")
  setUser(null)
  setIsLoggedIn(false)
}, [])



  return (
    <BrowserRouter>

      {/* ===== NAVBAR ===== */}
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
                ? <Navigate to="/dashboard" />
                : <Login setUser={setUser} setIsLoggedIn={setIsLoggedIn} />
            }
          />

          <Route
            path="/signup"
            element={
              isLoggedIn
                ? <Navigate to="/dashboard" />
                : <SignUp />
            }
          />

          {/* ===== PLAYER ROUTES ===== */}
          <Route
            path="/dashboard"
            element={
              !isLoggedIn
                ? <Navigate to="/" />
                : user?.role === 'admin'
                  ? <Navigate to="/admin" />
                  : <Dashboard user={user} />
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

          <Route
            path="/profile"
            element={
              isLoggedIn
                ? <Profile user={user} />
                : <Navigate to="/" />
            }
          />

          {/* ===== ADMIN ROUTES (SAFE) ===== */}
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
///sss