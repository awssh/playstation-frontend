import { useEffect, useState } from "react"

function MatchTime({ startDate }) {
  const [timezone, setTimezone] = useState("Asia/Amman")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)

    fetch(`https://worldtimeapi.org/api/timezone/${timezone}`)
      .then(res => {
        if (!res.ok) {
          throw new Error("API failed")
        }
        return res.json()
      })
      .then(() => {
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [timezone])

  if (loading) return <p>Loading match time...</p>

  if (error) {
    return (
      <p>
        <strong>Match Time:</strong>{" "}
        {new Date(startDate).toLocaleString(undefined, {
          timeZone: timezone
        })}
        <br />
        <small>(Offline mode)</small>
      </p>
    )
  }

  return (
    <div>
      <p>
        <strong>Match Time:</strong>{" "}
        {new Date(startDate).toLocaleString(undefined, {
          timeZone: timezone
        })}
      </p>

      <p>
        <strong>Timezone:</strong> {timezone}
      </p>

      <button onClick={() => setTimezone("Asia/Amman")}>
        Jordan
      </button>

      <button onClick={() => setTimezone("Europe/Berlin")}>
        Germany
      </button>
    </div>
  )
}

export default MatchTime
