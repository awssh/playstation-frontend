function MatchesSection({ matches = [], onSetWinner }) {
  return (
    <div className="matches-section">
      <h3>Matches</h3>
      {matches.length === 0 && <p>No matches yet</p>}

      {matches.map(match => (
        <div key={match.id} className="match-item">

          <div className="match-players">
            <div
              className={`match-player ${
                match.winner === match.player1 ? 'winner' : ''}`}>
              {match.player1}
            </div>

            <div className="match-vs">VS</div>

            <div
              className={`match-player ${
                match.winner === match.player2 ? 'winner' : ''
              }`}
            >
              {match.player2}
            </div>
          </div>

          {!match.winner && onSetWinner && (
            <div className="match-actions">
              <button onClick={() => onSetWinner(match.id, match.player1_id)}>
                {match.player1} Wins
              </button>
              <button onClick={() => onSetWinner(match.id, match.player2_id)}>
                {match.player2} Wins
              </button>
            </div>
          )}

          {match.winner && (
            <div className="match-winner-text">
              Winner: {match.winner}
            </div>
          )}

        </div>
      ))}
    </div>
  )
}

export default MatchesSection
