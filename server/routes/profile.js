import express from "express";
import db from "../db.js";

const router = express.Router();


router.get("/profile/details", async (req, res) => {
  const { userId } = req.query;

  const result = await db.query( "SELECT username, email, role FROM users WHERE id = $1",[userId]);

  res.json(result.rows[0]);
});
router.put("/profile/details", async (req, res) => {
  const { userId, username, email } = req.body;

  await db.query("UPDATE users SET username = $1, email = $2 WHERE id = $3",[username, email, userId]);

  res.json({ message: "Profile updated successfully" });});
router.get("/profile/stats", async (req, res) => {
  const { userId } = req.query;

  const joined = await db.query(
    `SELECT COUNT(*) 
     FROM tournament_requests 
     WHERE user_id = $1 AND status = 'approved'`,
    [userId]
  );

  const active = await db.query(
    `SELECT COUNT(*) 
     FROM tournament_requests tr
     JOIN tournaments t ON tr.tournament_id = t.id
     WHERE tr.user_id = $1 
     AND tr.status = 'approved'
     AND t.status = 'active'`,
    [userId]
  );

  const wins = await db.query(
    `SELECT COUNT(*) 
     FROM tournaments 
     WHERE winner_id = $1`,
    [userId]
  );

  res.json({
    joinedCount: Number(joined.rows[0].count),
    activeCount: Number(active.rows[0].count),
    winsCount: Number(wins.rows[0].count)
  });
});

export default router;
