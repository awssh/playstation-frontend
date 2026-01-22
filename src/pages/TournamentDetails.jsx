import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import '../style/tournamentDetails.css'
import TournamentHeader from '../components/tournament/TournamentHeader'
import PlayersList from '../components/tournament/PlayersList'
import MatchesSection from '../components/tournament/MatchesSection'
import JoinSection from '../components/tournament/JoinSection'

function TournamentDetails({ user }) {
  const { id } = useParams()

  const [tournament, setTournament] = useState(null)
  const [players, setPlayers] = useState([])
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [requestStatus, setRequestStatus] = useState(null)

  useEffect(() => {
    const fetchTournament = async () => {
      const res = await fetch(`http://localhost:3000/api/player/tournaments/${id}`)

      if (!res.ok) {
        setLoading(false)
        return
      }

      const data = await res.json()
      setTournament(data)
      setLoading(false)
    }

    fetchTournament()
  }, [id])

  useEffect(() => {
    if (!tournament) return

    const fetchPlayers = async () => {
      const res = await fetch(`http://localhost:3000/api/player/requests/approved/${tournament.id}`)

      if (!res.ok) {
        setPlayers([])
        return
      }

      const data = await res.json()
      setPlayers(Array.isArray(data) ? data : [])
    }

    fetchPlayers()
  }, [tournament])

  useEffect(() => {
    if (!tournament) return

    const fetchMatches = async () => {
      const res = await fetch(`http://localhost:3000/api/player/matches/${tournament.id}`)

      if (!res.ok) {
        setMatches([])
        return
      }

      const data = await res.json()
      setMatches(Array.isArray(data) ? data : [])
    }

    fetchMatches()
  }, [tournament])

  useEffect(() => {
    if (!user || !tournament) return

    const fetchRequestStatus = async () => {
      const res = await fetch(`http://localhost:3000/api/player/requests/status?user_id=${user.id}&tournament_id=${tournament.id}` )

      if (!res.ok) {
        setRequestStatus(null)
        return
      }

      const data = await res.json()
      setRequestStatus(data.status)
    }

    fetchRequestStatus()
  }, [user, tournament])

  const requestJoin = async () => {
    if (!user) {
      alert('Please login first')
      return
    }

    if (tournament.status !== 'upcoming') return

    const res = await fetch(
      'http://localhost:3000/api/player/requests/join',
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
