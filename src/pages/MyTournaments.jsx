import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../style/dashboard.css'

import API_URL from '../api'

function MyTournaments({ user }) {
  const navigate = useNavigate()
  const [myTournaments, setMyTournaments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchMyTournaments = async () => {
      try {
        const res = await fetch(
          API_URL + "/player/requests/my/" + user.id
        )

        if (!res.ok) {
          setMyTournaments([])
          setLoading(false)
          return
        }

        const data = await res.json()
        setMyTournaments(Array.isArray(data) ? data : [])
        setLoading(false)
      } catch (err) {
        console.error("Failed to fetch my tournaments", err)
        setMyTournaments([])
        setLoading(false)
      }
    }

    fetchMyTournaments()
  }, [user])

  if (loading) return <p>Loading...</p>

  return (
    <div className="dashboard-page">
      <h2>My Tournaments</h2>

      {myTournaments.length === 0 && (
        <p>You have not joined any tournaments yet.</p>
      )}

      {myTournaments.map(t => (
        <div
          key={t.tournament_id}
          className="tournament-row clickable"
          onClick={() => navigate(`/tournaments/${t.tournament_id}`)}
        >
          <div className="tournament-left">
            <div className="tournament-name">{t.name}</div>
            <div className="tournament-game">{t.game}</div>
          </div>

          <div className="tournament-right">
            <span className={`status-badge ${t.status}`}>
              {t.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MyTournaments
