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

  const fetchTournament = async () => {
    const res = await fetch(`${API}/admin/tournaments/${id}`, {
      headers: { 'x-role': 'admin' }
    })

    if (!res.ok) return

    const data = await res.json()
    setTournament(data)
  }

  const fetchPlayers = async () => {
    const res = await fetch(`${API}/admin/requests/approved/${id}`, {
      headers: { 'x-role': 'admin' }
    })

    if (!res.ok) {
      setPlayers([])
      return
    }

    const data = await res.json()
    setPlayers(Array.isArray(data) ? data : [])
  }

  /* ===== FETCH MATCHES ===== */
  const fetchMatches = async () => {
    const res = await fetch(`${API}/admin/matches/${id}`, {
      headers: { 'x-role': 'admin' }
    })

    if (!res.ok) {
      setMatches([])
      return
    }

    const data = await res.json()
    setMatches(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    fetchTournament()
    fetchPlayers()
    fetchMatches()
  }, [id])

  const deleteTournament = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this tournament?"
    )

    if (!confirmDelete) return

    const res = await fetch(`${API}/admin/tournaments/${id}`, {
      method: 'DELETE',
      headers: { 'x-role': 'admin' }
    })

    if (!res.ok) {
      alert("Delete failed")
      return
    }

    alert("Tournament deleted")
    navigate('/admin')
  }

  const startTournament = async () => {
    const res = await fetch(`${API}/admin/tournaments/${id}/start`, {
      method: 'PUT',
      headers: { 'x-role': 'admin' }
    })

    if (!res.ok) {
      alert("Failed to start tournament")
      return
    }

    const data = await res.json()
    setTournament(data)
  }

  const generateFirstRound = async () => {
    const res = await fetch(`${API}/admin/matches/generate/${id}`, {
      method: 'POST',
      headers: { 'x-role': 'admin' }
    })

    if (!res.ok) {
      alert("Failed to generate matches")
      return
    }

    fetchMatches()
  }

  /* ===== GENERATE NEXT ROUND ===== */
  const generateNextRound = async () => {
    const res = await fetch(`${API}/admin/matches/next-round/${id}`, {
      method: 'POST',
      headers: { 'x-role': 'admin' }
    })

    if (!res.ok) {
      alert("Failed to generate next round")
      return
    }

    fetchMatches()
  }

  /* ===== SET MATCH WINNER ===== */
  const setWinner = async (matchId, winnerId) => {
    const res = await fetch(`${API}/admin/matches/${matchId}/winner`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-role': 'admin'
      },
      body: JSON.stringify({ winner_id: winnerId })
    })

    if (!res.ok) return

    const data = await res.json()
    fetchMatches()

    if (data.tournament_winner) {
      alert("Tournament finished!")
      fetchTournament()
    }
  }

  return (
    <div className="tournament-details-page">
      <div className="details-card">

        <TournamentHeader
          tournament={tournament}
          playersCount={players.length}
          startTournament={startTournament}
        />

        <button className="btn btn-danger" onClick={deleteTournament}>
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
