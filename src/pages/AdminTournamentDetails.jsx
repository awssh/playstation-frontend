import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import '../style/adminTD.css'
import TournamentHeader from '../components/admin/TournamentHeader'
import PlayersList from '../components/admin/PlayersList'
import MatchesSection from '../components/admin/MatchesSection'
import RequestActions from '../components/admin/RequestActions'

import API_URL from '../api'

function AdminTournamentDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [tournament, setTournament] = useState(null)
  const [players, setPlayers] = useState([])
  const [matches, setMatches] = useState([])

  const fetchTournament = async () => {
    try {
      const res = await fetch(
        API_URL + "/admin/tournaments/" + id,
        { headers: { 'x-role': 'admin' } }
      )

      if (!res.ok) return

      const data = await res.json()
      setTournament(data)
    } catch (err) {
      console.error("Failed to fetch tournament", err)
    }
  }

  const fetchPlayers = async () => {
    try {
      const res = await fetch(
        API_URL + "/admin/requests/approved/" + id,
        { headers: { 'x-role': 'admin' } }
      )

      if (!res.ok) {
        setPlayers([])
        return
      }

      const data = await res.json()
      setPlayers(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Failed to fetch players", err)
      setPlayers([])
    }
  }

  const fetchMatches = async () => {
    try {
      const res = await fetch(
        API_URL + "/admin/matches/" + id,
        { headers: { 'x-role': 'admin' } }
      )

      if (!res.ok) {
        setMatches([])
        return
      }

      const data = await res.json()
      setMatches(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Failed to fetch matches", err)
      setMatches([])
    }
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

    try {
      const res = await fetch(
        API_URL + "/admin/tournaments/" + id,
        {
          method: 'DELETE',
          headers: { 'x-role': 'admin' }
        }
      )

      if (!res.ok) {
        alert("Delete failed")
        return
      }

      alert("Tournament deleted")
      navigate('/admin')
    } catch (err) {
      console.error("Delete tournament failed", err)
      alert("Delete failed")
    }
  }

  const startTournament = async () => {
    try {
      const res = await fetch(
        API_URL + "/admin/tournaments/" + id + "/start",
        {
          method: 'PUT',
          headers: { 'x-role': 'admin' }
        }
      )

      if (!res.ok) {
        alert("Failed to start tournament")
        return
      }

      const data = await res.json()
      setTournament(data)
    } catch (err) {
      console.error("Start tournament failed", err)
      alert("Failed to start tournament")
    }
  }

  const generateFirstRound = async () => {
    try {
      const res = await fetch(
        API_URL + "/admin/matches/generate/" + id,
        {
          method: 'POST',
          headers: { 'x-role': 'admin' }
        }
      )

      if (!res.ok) {
        alert("Failed to generate matches")
        return
      }

      fetchMatches()
    } catch (err) {
      console.error("Generate first round failed", err)
      alert("Failed to generate matches")
    }
  }

  const generateNextRound = async () => {
    try {
      const res = await fetch(
        API_URL + "/admin/matches/next-round/" + id,
        {
          method: 'POST',
          headers: { 'x-role': 'admin' }
        }
      )

      if (!res.ok) {
        alert("Failed to generate next round")
        return
      }

      fetchMatches()
    } catch (err) {
      console.error("Generate next round failed", err)
      alert("Failed to generate next round")
    }
  }

  const setWinner = async (matchId, winnerId) => {
    try {
      const res = await fetch(
        API_URL + "/admin/matches/" + matchId + "/winner",
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-role': 'admin'
          },
          body: JSON.stringify({ winner_id: winnerId })
        }
      )

      if (!res.ok) return

      const data = await res.json()
      fetchMatches()

      if (data.tournament_winner) {
        alert("Tournament finished!")
        fetchTournament()
      }
    } catch (err) {
      console.error("Set winner failed", err)
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
