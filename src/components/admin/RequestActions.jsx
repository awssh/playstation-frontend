import { useEffect, useState } from "react";

function RequestActions({ tournamentId }) {
  const [requests, setRequests] = useState([]);

  const fetchRequests = () => {
    fetch(`http://localhost:3000/api/tournamentRequests/pending/${tournamentId}`, {
      headers: {
        "x-role": "admin"
      }
    })
      .then(res => res.json())
      .then(data => setRequests(data));
  };

  useEffect(() => {
    fetchRequests();
  }, [tournamentId]);

  const approve = async (id) => {
    await fetch(
      `http://localhost:3000/api/tournamentRequests/approve/${id}`,
      {
        method: "PUT",
        headers: { "x-role": "admin" }
      }
    );
    fetchRequests();
  };

  const reject = async (id) => {
    await fetch(
      `http://localhost:3000/api/tournamentRequests/reject/${id}`,
      {
        method: "PUT",
        headers: { "x-role": "admin" }
      }
    );
    fetchRequests();
  };

  if (requests.length === 0) {
    return <p>No pending requests</p>;
  }

  return (
    <div className="request-actions">
      <h3>Pending Join Requests</h3>

      {requests.map(req => (
        <div key={req.id} className="request-row">
          <span>{req.username}</span>

          <button onClick={() => approve(req.id)}>Approve</button>
          <button onClick={() => reject(req.id)}>Reject</button>
        </div>
      ))}
    </div>
  );
}

export default RequestActions;
