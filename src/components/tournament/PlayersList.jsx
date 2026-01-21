function PlayersList({ players }) {
  return (
    <div className="players-section">
      <h3>Players</h3>

      {players.map(player => (
        <div
          key={player.id}
          className="player-item"
          data-avatar={player.username[0].toUpperCase()}
        >
          {player.username}
        </div>
      ))}
    </div>
  )
}

export default PlayersList
