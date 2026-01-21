import '../style/tournaments.css'
import MatchTime from '../components/MatchTime'

import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

function AllTournaments({ user }) {
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetch('http://localhost:3000/api/tournaments')
      .then(res => res.json())
      .then(data => {
        setTournaments(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setTournaments([])
        setLoading(false)
      })
  }, [])




  const filteredTournaments = tournaments.filter(t => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.game.toLowerCase().includes(search.toLowerCase())

    const matchStatus =
      statusFilter === 'all' || t.status === statusFilter

    return matchSearch && matchStatus
  })

  return (
    <div className="all-page">
      <h2 className="page-title">All Tournaments</h2>

      <div className="filters-card">
        <input
          type="text"
          placeholder="Search tournaments or games..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="upcoming">Upcoming</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="cards-grid">
        {filteredTournaments.map(t => {
     const approved = Number(t.players_count) || 0
const progress = (approved / t.max_players) * 100

          return (
            <Link
              key={t.id}
              to={
                user?.role === 'admin'
                  ? `/admin/tournaments/${t.id}`
                  : `/tournaments/${t.id}`
              }
              className="tournament-card"
            >
              <div className="card-header">
                <h3>{t.name}</h3>
                <span className={`status ${t.status}`}>
                  {t.status}
                </span>
              </div>

              <p className="game">{t.game}</p>

              <div className="info">
                <span>Players</span>
<span>{approved}/{t.max_players}</span>
              </div>

              <div className="info">
                {t.start_date ? (
                  <MatchTime startDate={t.start_date} />
                ) : (
                  <span>Start Date: TBA</span>
                )}
              </div>

              <div className="info">
                <span>Prize</span>
                <span className="prize">{t.prize}</span>
              </div>

              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default AllTournaments
