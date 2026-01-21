import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../style/dashboard.css'
import '../style/layout.css'

function Dashboard({ user }) {
  const navigate = useNavigate()

  const [tournaments, setTournaments] = useState([])
  const [myRequests, setMyRequests] = useState([])
  const [playersCount, setPlayersCount] = useState({})

  useEffect(() => {
    fetch('http://localhost:3000/api/tournaments')
      .then(res => res.json())
      .then(data => setTournaments(data))
  }, [])

  useEffect(() => {
    if (!user) return

    fetch(`http://localhost:3000/api/tournamentRequests/my/${user.id}`)
      .then(res => res.json())
      .then(data => setMyRequests(data))
  }, [user])

  useEffect(() => {
    tournaments.forEach(t => {
      fetch(`http://localhost:3000/api/tournamentRequests/approved/${t.id}`)
        .then(res => res.json())
        .then(data => {
          setPlayersCount(prev => ({
            ...prev,
            [t.id]: data.length
          }))
        })
    })
  }, [tournaments])

  const myTournamentIds = myRequests
    .filter(r => r.status === 'approved')
    .map(r => r.tournament_id)

  const myTournaments = tournaments.filter(t =>
    myTournamentIds.includes(t.id)
  )

  const activeTournaments = tournaments.filter(t => t.status === 'active')
  const availableTournaments = tournaments.filter(t => t.status === 'upcoming')

  const totalPlayers = Object.values(playersCount).reduce(
    (sum, n) => sum + n,0 )

  return (
    <div className="dashboard-page">

      <div className="dashboard-header">
        Welcome Back, {user.username}
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-blue">
          <div className="stat-label">My Tournaments</div>
          <div className="stat-number">{myTournaments.length}</div>
        </div>

        <div className="stat-card stat-green">
          <div className="stat-label">Active</div>
          <div className="stat-number">{activeTournaments.length}</div>
        </div>

        <div className="stat-card stat-orange">
          <div className="stat-label">Upcoming</div>
          <div className="stat-number">{availableTournaments.length}</div>
        </div>

        <div className="stat-card stat-purple">
          <div className="stat-label">Total Players</div>
          <div className="stat-number">{totalPlayers}</div>
        </div>
      </div>

      <div className="sections-grid">

        <div className="section-card">
          <div className="section-title">Upcoming Tournaments</div>

          {availableTournaments.length === 0 && (
            <div className="empty-text">No upcoming tournaments.</div>
          )}

          {availableTournaments.map(t => (
            <div
              key={t.id}
              className="tournament-row clickable"
              onClick={() => navigate(`/tournaments/${t.id}`)}
            >
              <div className="tournament-left">
                <div className="tournament-name">{t.name}</div>
                <div className="tournament-game">{t.game}</div>
              </div>

              <div className="tournament-right">
                <div className="players-count">
                  {(playersCount[t.id] || 0)}/{t.max_players} Players
                </div>
                <div className="prize">{t.prize}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="section-card">
          <div className="section-title">My Active Tournaments</div>

          {myTournaments.filter(t => t.status === 'active').length === 0 && (
            <div className="empty-text">
              You're not in any live tournaments.
            </div>
          )}

          {myTournaments
            .filter(t => t.status === 'active')
            .map(t => (
              <div
                key={t.id}
                className="tournament-row clickable"
                onClick={() => navigate(`/tournaments/${t.id}`)}
              >
                <div className="tournament-left">
                  <div className="tournament-name">{t.name}</div>
                  <div className="tournament-game">{t.game}</div>
                </div>

                <div className="tournament-right">
                  <div className="prize">{t.prize}</div>
                </div>
              </div>
            ))}
        </div>

      </div>
    </div>
  )
}

export default Dashboard
