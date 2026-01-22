# 🎮 PlayStation Tournament System – Frontend

This is the **frontend** of the PlayStation Tournament System web application.
It is built using **React** and **Vite** and provides the user interface for players and admins
to interact with tournaments.

---

## 🎯 Project Description

The application allows users to view and manage PlayStation tournaments.
There are two main roles in the system:

### 👤 Player
- View all tournaments
- View tournament details
- Join tournaments
- View personal tournaments
- Edit personal profile

### 🛠️ Admin
- Create tournaments
- Edit tournament details
- Manage players
- View and control tournament matches
- Approve or reject requests

The frontend communicates with a backend API to fetch and update data.
User authentication is handled and session data is stored on the client side.

---

## 🧑‍💻 User Requirements

- Users can **sign up** and **log in**
- Logged-in users can access protected pages
- Different pages are shown based on the user role (Admin / Player)

### Player Requirements
- View all tournaments
- Join tournaments
- View joined tournaments
- View match time and tournament details
- Update profile information

### Admin Requirements
- Access admin dashboard
- Create and manage tournaments
- View players list
- Manage matches and requests

---

## 📁 Project Structure

```text
client/
└── src/
    ├── components/
    │   ├── admin/
    │   ├── tournament/
    │   ├── Navbar.jsx
    │   └── MatchTime.jsx
    ├── pages/
    │   ├── AllTournaments.jsx
    │   ├── TournamentDetails.jsx
    │   ├── MyTournaments.jsx
    │   ├── Profile.jsx
    │   ├── AdminDashboard.jsx
    │   └── AdminTournamentDetails.jsx
    ├── routes/
    ├── style/
    ├── App.jsx
    └── main.jsx

```

---

## 🛠️ Technologies Used

- React (with Hooks)
- Vite
- React Router DOM
- Bootstrap & React-Bootstrap
- Framer Motion
- Fetch API
- CSS (custom styles)

---

## 🔐 Authentication & Authorization

- Users must log in to access protected pages
- Admin and Player roles have different access permissions
- Authentication state is managed on the frontend
- Session data is stored using **localStorage**

---

## 🚀 Getting Started

To run the frontend locally:

```bash
cd client
npm install
npm run dev

