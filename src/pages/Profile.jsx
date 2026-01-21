import { useState, useEffect } from "react";
import "../style/profile.css";

function Profile({ user }) {
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    username: "",
    email: ""
  });
const [stats, setStats] = useState({
  joinedCount: 0,
  activeCount: 0,
  winsCount: 0
});
useEffect(() => {
  if (!user) return;

  fetch(`http://localhost:3000/api/profile/stats?userId=${user.id}`)
    .then(res => res.json())
    .then(data => setStats(data));
}, [user]);

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:3000/api/profile/details?userId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          username: data.username,
          email: data.email
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSave = async () => {
    await fetch("http://localhost:3000/api/profile/details", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: user.id,
        username: formData.username,
        email: formData.email
      })
    });

    const updatedUser = {
      ...user,
      username: formData.username,
      email: formData.email
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setEdit(false);
  };


  return (
    <div className="profile-page">
      <h2>Profile</h2>

      <div className="profile-grid">

        <div className="profile-card">
          <div className="avatar">
            {formData.username.charAt(0).toUpperCase()}
          </div>

          <h3>{formData.username}</h3>
          <p className="email">{formData.email}</p>

          <span className="role-badge">{user.role}</span>
<div className="stats">
  <div>
    <strong>{stats.joinedCount}</strong>
    <span>Tournaments</span>
  </div>

  <div>
    <strong>{stats.winsCount}</strong>
    <span>Wins</span>
  </div>

  <div>
    <strong>{stats.activeCount}</strong>
    <span>Active</span>
  </div>
</div>

     
        </div>

        {/* RIGHT */}
        <div className="info-card">
          <div className="info-header">
            <h3>Account Information</h3>

            {!edit ? (
              <button onClick={() => setEdit(true)}>
                Edit Profile
              </button>
            ) : (
              <button onClick={handleSave}>
                Save
              </button>
            )}
          </div>

          <ul>
            <li>
              <strong>Username:</strong>
              {edit ? (
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              ) : (
                formData.username
              )}
            </li>

            <li>
              <strong>Email:</strong>
              {edit ? (
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              ) : (
                formData.email
              )}
            </li>

            <li>
              <strong>Account Type:</strong> {user.role}
            </li>
          </ul>
          
        </div>

      </div>
    </div>
  );
}

export default Profile;
