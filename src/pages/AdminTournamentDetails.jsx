import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import '../style/adminTD.css'
import TournamentHeader from '../components/admin/TournamentHeader'
import PlayersList from '../components/admin/PlayersList'
import MatchesSection from '../components/admin/MatchesSection'
import RequestActions from '../components/admin/RequestActions'


const API = 'http://localhost:3000/api'

function AdminTournamentDetails() {
  
  const { id } = useParams()
  const navigate = useNavigate()

  const [tournament, setTournament] = useState(null)
  const [players, setPlayers] = useState([])
  const [matches, setMatches] = useState([])

  /* ===== DELETE TOURNAMENT ===== */
const deleteTournament = async () => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this tournament?"
  )

  if (!confirmDelete) return

  const res = await fetch(`${API}/tournaments/${id}`, {
    method: 'DELETE',
    headers: {
      'x-role': 'admin'
    }
  })

  if (!res.ok) {
    alert("Delete failed")
    return
  }

  alert("Tournament deleted")
  navigate('/admin')
}

  useEffect(() => {
    fetch(`${API}/tournaments/${id}`)
      .then(res => res.json())
      .then(setTournament)
  }, [id])

  const fetchPlayers = () => {
    fetch(`${API}/tournamentRequests/approved/${id}`)
      .then(res => res.json())
      .then(setPlayers)
  }

  const fetchMatches = () => {
    fetch(`${API}/matches/${id}`)
      .then(res => res.json())
      .then(setMatches)
  }

  useEffect(() => {
    fetchPlayers()
    fetchMatches()
  }, [id])

  const generateFirstRound = async () => {
    await fetch(`${API}/matches/generate/${id}`, {
      method: 'POST',
    })
    fetchMatches()
  }

  const generateNextRound = async () => {
    await fetch(`${API}/matches/next-round/${id}`, {
      method: 'POST',
    })
    fetchMatches()
  }

  const setWinner = async (matchId, winnerId) => {
    const res = await fetch(`${API}/matches/${matchId}/winner`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ winner_id: winnerId }),
    })

    const data = await res.json()
    fetchMatches()

    if (data.tournament_winner) {
      alert("Tournament finished!")
      fetch(`${API}/tournaments/${id}`)
        .then(res => res.json())
        .then(setTournament)
    }
  }


  return (
    <div className="tournament-details-page">
      
      <div className="details-card">

        <TournamentHeader
          tournament={tournament}
          playersCount={players.length}
        />
        <button
  className="btn btn-danger"
  onClick={deleteTournament}
>
  Delete Tournament
</button>

<RequestActions tournamentId={id} />

        <PlayersList players={players} />

        {matches.length === 0 && players.length >= 2 && (
          <button className="start-btn" onClick={generateFirstRound}>
            Generate Matches
          </button>
        )}

        {matches.length > 0 &&
          matches.every(m => m.winner) &&
          matches.length > 1 && (
            <button className="start-btn" onClick={generateNextRound}>
              Generate Next Round
            </button>
          )}

        <MatchesSection
          matches={matches}
          onSetWinner={setWinner}
        />

      </div>
    </div>
  )
}

export default AdminTournamentDetails
