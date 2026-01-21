import express from "express";
import dotenv from "dotenv";

import tournamentsRoutes from "./routes/tournaments.js";
import matchesRoutes from "./routes/matches.js";
import authRoutes from "./routes/auth.js";
import cors from "cors";
import profileRoutes from './routes/profile.js'
import tournamentRequestRoutes from "./routes/tournamentRequests.js";



dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use('/api/profile', profileRoutes)
app.use("/api/tournamentRequests", tournamentRequestRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/tournaments", tournamentsRoutes);
app.use("/api/matches", matchesRoutes);
app.use("/api", profileRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
