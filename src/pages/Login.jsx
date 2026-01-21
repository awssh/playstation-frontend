import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../style/auth.css'


function Login({ setUser, setIsLoggedIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage('')

    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.message || 'Login failed')
        return
      }

      const loggedUser = data.user || data

if (!loggedUser || !loggedUser.role) {
  setMessage('Invalid login response from server')
  return
}

setUser(loggedUser)
setIsLoggedIn(true)
localStorage.setItem('user', JSON.stringify(loggedUser))

if (loggedUser.role === 'admin') {
  navigate('/admin/requests')
} else {
  navigate('/')
}

    } catch (err) {
      console.error(err)
      setMessage('Server error')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-icon">🎮</div>

        <h2>PlayStation Tournaments</h2>
        <p className="subtitle">Sign in to your account</p>

        <form onSubmit={handleLogin}>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn btn-success bg-success">
            Sign In
          </button>
        </form>

        {message && <p className="error">{message}</p>}

        <p className="register">
          Don&apos;t have an account? <Link to="/signup">Register here</Link>
        </p>

      </div>
    </div>
  )
}

export default Login
