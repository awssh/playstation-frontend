function JoinSection({canRequest,hasRequested,isPlayer,onRequestJoin}) {
  return (
    <>
      {canRequest && (
        <button className="primary-btn" onClick={onRequestJoin}>
          Request to Join
        </button>
      )}

      {hasRequested && (
        <p className="info-text">
          ⏳ Waiting for admin approval
        </p>
      )}

      {isPlayer && (
        <p className="success-text">
          You are registered ✔
        </p>
      )}
    </>
  )
}

export default JoinSection
