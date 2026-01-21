function MatchesSection({ matches = [] }) {

  // GROUP MATCHES BY ROUND
  const rounds = matches.reduce((acc, match) => {
    acc[match.round] = acc[match.round] || []
    acc[match.round].push(match)
    return acc
  }, {})

  const sortedRounds = Object.keys(rounds).sort((a, b) => a - b)

  return (
    <div className="matches-section">
      <h3>Matches</h3>

      {matches.length === 0 && <p>No matches yet</p>}

      {sortedRounds.map((round, index) => {
        const isFinal = index === sortedRounds.length - 1

        return (
          <div key={round} className="round-block">

            <h4 className="round-title">
              {isFinal ? "Final Round" : `Round ${round}`}
            </h4>

            {rounds[round].map(match => (
              <div key={match.id} className="player-match">

                <div className="player-match-row">
                  <div
                    className={`player-name ${
                      match.winner === match.player1 ? 'winner' : ''
                    }`}
                  >
                    {match.player1}
                  </div>

                  <div className="player-vs">VS</div>

                  <div
                    className={`player-name ${
                      match.winner === match.player2 ? 'winner' : ''
                    }`}
                  >
                    {match.player2}
                  </div>
                </div>

                {!match.winner && (
                  <div className="match-waiting">
                    Waiting for result ⏳
                  </div>
                )}

                {match.winner && (
                  <div className="match-winner">
                    Winner: {match.winner}
                  </div>
                )}
              </div>
            ))}

          </div>
        )
      })}
    </div>
  )
}

export default MatchesSection
