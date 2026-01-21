function PlayersList({ players }) {
  return (
    <div className="players-section">
      <h3>Registered Players</h3>

      {players.length === 0 && (
        <p>No players yet</p>
      )}

      {players.map((p, index) => (
        <div key={index} className="player-item">
          {p.username}
        </div>
      ))}
    </div>
  )
}

export default PlayersList
