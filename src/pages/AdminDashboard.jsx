import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../style/admin.css'
import API_URL from '../api'

function AdminDashboard() {
  const [tournaments, setTournaments] = useState([])
  const [name, setName] = useState('')
  const [game, setGame] = useState('')
  const [maxPlayers, setMaxPlayers] = useState(16)
  const [startDate, setStartDate] = useState('')
  const [prize, setPrize] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const fetchTournaments = async () => {
      const res = await fetch(`${API_URL}/admin/tournaments`, {
        headers: {
          'x-role': 'admin'
        }
      })

      if (!res.ok) return

      const data = await res.json()
      setTournaments(Array.isArray(data) ? data : [])
    }

    fetchTournaments()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()

    const res = await fetch(`${API_URL}/admin/tournaments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-role': 'admin'
      },
      body: JSON.stringify({
        name,
        game,
        max_players: maxPlayers,
        start_date: startDate,
        prize
      })
    })

    if (!res.ok) return

    const newTournament = await res.json()
    setTournaments(prev => [newTournament, ...prev])

    setShowForm(false)
    setName('')
    setGame('')
    setMaxPlayers(16)
    setStartDate('')
    setPrize('')
  }

  const total = tournaments.length
  const upcoming = tournaments.filter(t => t.status === 'upcoming').length
  const active = tournaments.filter(t => t.status === 'active').length
  const completed = tournaments.filter(t => t.status === 'completed').length

  return (
    <div className="admin-dashboard">
      <div className="admin-container">

        <div className="admin-header">
          <h1 className="admin-title">Admin Dashboard</h1>
          <button
            className="admin-btn primary-btn"
            onClick={() => setShowForm(!showForm)}
          >
            + Create Tournament
          </button>
        </div>

        {showForm && (
          <div className="admin-card create-card">
            <h3 className="admin-section-title">Create New Tournament</h3>

            <form className="admin-form create-form" onSubmit={handleCreate}>
              <div className="form-row">
                <div className="form-group">
                  <label>Tournament Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label>Game</label>
                  <input value={game} onChange={e => setGame(e.target.value)} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Max Players</label>
                  <select
                    value={maxPlayers}
                    onChange={e => setMaxPlayers(Number(e.target.value))}
                  >
                    <option value={8}>8</option>
                    <option value={16}>16</option>
                    <option value={32}>32</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Start Date & Time</label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Prize</label>
                  <input value={prize} onChange={e => setPrize(e.target.value)} required />
                </div>
              </div>

              <div className="form-actions">
                <button className="admin-btn primary-btn">Create Tournament</button>
                <button
                  type="button"
                  className="admin-btn secondary-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="admin-stats">
          <div className="stat-card"><h4>Total</h4><p>{total}</p></div>
          <div className="stat-card"><h4>Upcoming</h4><p>{upcoming}</p></div>
          <div className="stat-card"><h4>Active</h4><p>{active}</p></div>
          <div className="stat-card"><h4>Completed</h4><p>{completed}</p></div>
        </div>

        <div className="admin-tournaments">
          <h3 className="admin-section-title">All Tournaments</h3>

          {tournaments.map(t => (
            <Link
              key={t.id}
              to={`/admin/tournaments/${t.id}`}
              className="tournament-link"
            >
              <div className="tournament-card admin-card">
                <div className="tournament-left">
                  <h4>{t.name}</h4>
                  <p className="game">{t.game}</p>
                  <p>Start (UTC): {new Date(t.start_date).toUTCString()}</p>
                </div>

                <div className="tournament-right tournament-info">
                  <span className="players-count">
                    Players {Number(t.players_count)}/{t.max_players}
                  </span>
                  <span className={`status ${t.status}`}>
                    {t.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}

export default AdminDashboard
