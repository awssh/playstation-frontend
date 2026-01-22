import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import '../style/tournamentDetails.css'
import TournamentHeader from '../components/tournament/TournamentHeader'
import PlayersList from '../components/tournament/PlayersList'
import MatchesSection from '../components/tournament/MatchesSection'
import JoinSection from '../components/tournament/JoinSection'

import API_URL from '../api'

function TournamentDetails({ user }) {
  const { id } = useParams()

  const [tournament, setTournament] = useState(null)
  const [players, setPlayers] = useState([])
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [requestStatus, setRequestStatus] = useState(null)

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const res = await fetch(
          API_URL + "/player/tournaments/" + id
        )

        if (!res.ok) {
          setLoading(false)
          return
        }

        const data = await res.json()
        setTournament(data)
        setLoading(false)
      } catch (err) {
        console.error("Failed to fetch tournament", err)
        setLoading(false)
      }
    }

    fetchTournament()
  }, [id])

  useEffect(() => {
    if (!tournament) return

    const fetchPlayers = async () => {
      try {
        const res = await fetch(
          API_URL + "/player/requests/approved/" + tournament.id
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

    fetchPlayers()
  }, [tournament])

  useEffect(() => {
    if (!tournament) return

    const fetchMatches = async () => {
      try {
        const res = await fetch(
          API_URL + "/player/matches/" + tournament.id
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

    fetchMatches()
  }, [tournament])

  useEffect(() => {
    if (!user || !tournament) return

    const fetchRequestStatus = async () => {
      try {
        const res = await fetch(
          API_URL +
            "/player/requests/status?user_id=" +
            user.id +
            "&tournament_id=" +
            tournament.id
        )

        if (!res.ok) {
          setRequestStatus(null)
          return
        }

        const data = await res.json()
        setRequestStatus(data.status)
      } catch (err) {
        console.error("Failed to fetch request status", err)
        setRequestStatus(null)
      }
    }

    fetchRequestStatus()
  }, [user, tournament])

  const requestJoin = async () => {
    if (!user) {
      alert('Please login first')
      return
    }

    if (tournament.status !== 'upcoming') return

    try {
      const res = await fetch(
        API_URL + "/player/requests/join",
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.id,
            tournament_id: tournament.id
          })
        }
      )

      if (res.ok) setRequestStatus('pending')
    } catch (err) {
      console.error("Join request failed", err)
    }
  }

  if (loading) return <p>Loading tournament...</p>
  if (!tournament) return <p>Tournament not found</p>

  const canJoinTournament =
    tournament.status === 'upcoming' && requestStatus === null

  return (
    <div className="tournament-details-page">
      <div className="details-card">

        <TournamentHeader
          tournament={tournament}
          playersCount={players.length}
        />

        {user && tournament.status === 'upcoming' && (
          <JoinSection
            canRequest={canJoinTournament}
            hasRequested={requestStatus === 'pending'}
            isPlayer={requestStatus === 'approved'}
            onRequestJoin={requestJoin}
          />
        )}

        <PlayersList players={players} />

        <MatchesSection matches={matches} />

        {tournament.winner_name && (
          <p className="tournament-winner">
            🏆 Tournament Winner: {tournament.winner_name}
          </p>
        )}

      </div>
    </div>
  )
}

export default TournamentDetails
