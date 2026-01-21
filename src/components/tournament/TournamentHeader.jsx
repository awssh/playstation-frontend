import MatchTime from '../MatchTime'

function TournamentHeader({ tournament, playersCount }) {
  return (
    <div className="tournament-header">
      <h2>{tournament.name}</h2>
      <p>Game: {tournament.game}</p>
      <p>Status: {tournament.status}</p>
      {tournament.start_date ? (
  <MatchTime startDate={tournament.start_date} />
) : (
  <p>Start Date: TBA</p>
)}

      <p>
        Players: {playersCount} / {tournament.max_players}
      </p>
    </div>
  )
}

export default TournamentHeader
