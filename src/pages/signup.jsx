import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import "../style/auth.css"

import API_URL from "../api"

function SignUp() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault()
    setMessage("")

    try {
      const res = await fetch(
        API_URL + "/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username,
            email,
            password,
            role: "player"
          })
        }
      )

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.message || "Signup failed")
        return
      }

      navigate("/")
    } catch (error) {
      console.error("Signup error", error)
      setMessage("Server error")
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-icon">🎮</div>

        <h2>Create Account</h2>
        <p className="subtitle">Join PlayStation Tournaments</p>

        <form onSubmit={handleSignUp}>
          <label>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn btn-success bg-success">
            Create Account
          </button>
        </form>

        {message && <p className="error">{message}</p>}

        <p className="register">
          Already have an account? <Link to="/">Sign in here</Link>
        </p>

      </div>
    </div>
  )
}

export default SignUp
