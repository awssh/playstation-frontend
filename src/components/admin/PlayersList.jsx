function PlayersList({ players = [] }) {
  if (!Array.isArray(players)) return null

  return (
    <div className="players-section">
      <h3>Players</h3>

      {players.map(player => (
        <div key={player.id} className="player-item">
          {player.username}
        </div>
      ))}
    </div>
  )
}
export default PlayersList
