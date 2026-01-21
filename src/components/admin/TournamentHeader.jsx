import MatchTime from '../MatchTime'
function TournamentHeader({ tournament, playersCount, startTournament }) {
  if (!tournament) return null

  return (
    <>
      <h2>{tournament.name}</h2>
      <p className="game">{tournament.game}</p>
{tournament.start_date ? (
  <MatchTime startDate={tournament.start_date} />
) : (
  <p>Start Date: TBA</p>
)}
      <p>
        Status:
        <span className={`status ${tournament.status}`}>
          {tournament.status}
        </span>
      </p>

      <p>
        Players: {playersCount}/{tournament.max_players}
      </p>

      <p className="prize">
        Prize: {tournament.prize}
      </p>

      {tournament.status === 'upcoming' && (
        <button className="primary-btn" onClick={startTournament}>
          Start Tournament
        </button>
      )}
    </>
  )
}

export default TournamentHeader
