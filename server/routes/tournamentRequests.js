import express from "express";
import db from "../db.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();


router.post("/join", async (req, res) => {
  const { user_id, tournament_id } = req.body;

  const exists = await db.query(
    `
    SELECT * FROM tournament_requests
    WHERE user_id = $1 AND tournament_id = $2
    `,
    [user_id, tournament_id]
  );

  if (exists.rows.length > 0) {
    return res.status(400).json({ message: "Request already exists" });
  }

  const result = await db.query(
    `
    INSERT INTO tournament_requests (user_id, tournament_id, status)
    VALUES ($1, $2, 'pending')
    RETURNING *
    `,
    [user_id, tournament_id]
  );

  res.status(201).json(result.rows[0]);
});


router.get("/status", async (req, res) => {
  const { user_id, tournament_id } = req.query;

  const result = await db.query(
    `
    SELECT status FROM tournament_requests
    WHERE user_id = $1 AND tournament_id = $2
    `,
    [user_id, tournament_id]
  );

  if (result.rows.length === 0) {
    return res.json({ status: null });
  }

  res.json({ status: result.rows[0].status });
});


router.get("/approved/:tournamentId", async (req, res) => {
  const result = await db.query(
    `
    SELECT u.id, u.username
    FROM tournament_requests tr
    JOIN users u ON tr.user_id = u.id
    WHERE tr.tournament_id = $1
      AND tr.status = 'approved'
    `,
    [req.params.tournamentId]
  );

  res.json(result.rows);
});


router.get("/pending/:tournamentId", adminAuth, async (req, res) => {
  const result = await db.query(
    `
    SELECT tr.id, tr.user_id, u.username
    FROM tournament_requests tr
    JOIN users u ON tr.user_id = u.id
    WHERE tr.tournament_id = $1
      AND tr.status = 'pending'
    `,
    [req.params.tournamentId]
  );

  res.json(result.rows);
});


router.put("/approve/:id", adminAuth, async (req, res) => {
  const result = await db.query(
    `
    UPDATE tournament_requests
    SET status = 'approved'
    WHERE id = $1
    RETURNING *
    `,
    [req.params.id]
  );

  res.json(result.rows[0]);
});


router.put("/reject/:id", adminAuth, async (req, res) => {
  const result = await db.query(
    `
    UPDATE tournament_requests
    SET status = 'rejected'
    WHERE id = $1
    RETURNING *
    `,
    [req.params.id]
  );

  res.json(result.rows[0]);
});

router.get('/my/:userId', async (req, res) => {
  const { userId } = req.params

  try {
    const result = await db.query(
      `
      SELECT
        tr.tournament_id,
        tr.status,
        t.name,
        t.game
      FROM tournament_requests tr
      JOIN tournaments t ON tr.tournament_id = t.id
      WHERE tr.user_id = $1
      ORDER BY tr.id DESC
      `,
      [userId]
    )

    res.json(result.rows)
  } catch (err) {
    res.json({ message: 'Server error' })
  }
})

export default router;
