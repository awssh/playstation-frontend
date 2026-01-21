import express from "express";
import db from "../db.js";
import adminAuth from "../middleware/adminAuth.js"

const router = express.Router();

//get  tournament by id 
router.get("/:tournamentId", async (req, res) => {
  const { tournamentId } = req.params;

  const result = await db.query(
    `
   
  SELECT 
  m.id,
  m.round,
  u1.id AS player1_id,
  u1.username AS player1,
  u2.id AS player2_id,
  u2.username AS player2,
  u3.username AS winner

    FROM matches m
    JOIN users u1 ON m.player1_id = u1.id
    JOIN users u2 ON m.player2_id = u2.id
    LEFT JOIN users u3 ON m.winner_id = u3.id
    WHERE m.tournament_id = $1
    ORDER BY m.round, m.id
    `,
    [tournamentId]
  );

  res.json(result.rows);
});


   //GENERATE FIRST ROUND

router.post("/generate/:tournamentId", adminAuth,async (req, res) => {
  const { tournamentId } = req.params;

  const playersRes = await db.query(
    `
    SELECT u.id
    FROM tournament_requests tr
    JOIN users u ON tr.user_id = u.id
    WHERE tr.tournament_id = $1
      AND tr.status = 'approved'
    ORDER BY tr.id
    `,
    [tournamentId]
  );

  const players = playersRes.rows;

  if (players.length < 2) {
    return res.status(400).json({ message: "Not enough players" });
  }

  // create round 1
  for (let i = 0; i < players.length; i += 2) {

    await db.query(
      `
      INSERT INTO matches (tournament_id, player1_id, player2_id, round)
      VALUES ($1, $2, $3, 1)
      `,
      [tournamentId, players[i].id, players[i + 1].id]
    );
  }

  res.json({ message: "Round 1 generated" });
});


router.put("/:matchId/winner",adminAuth, async (req, res) => {
  const { matchId } = req.params;
  const { winner_id } = req.body;

  const matchRes = await db.query(
    `
    UPDATE matches
    SET winner_id = $1
    WHERE id = $2
    RETURNING tournament_id, round
    `,
    [winner_id, matchId]
  );

  const { tournament_id, round } = matchRes.rows[0];

  const countRes = await db.query(
    `
    SELECT COUNT(*) AS total
    FROM matches
    WHERE tournament_id = $1 AND round = $2
    `,
    [tournament_id, round]
  );

  const winnersRes = await db.query(
    `
    SELECT COUNT(*) AS winners
    FROM matches
    WHERE tournament_id = $1
      AND round = $2
      AND winner_id IS NOT NULL
    `,
    [tournament_id, round]
  );

  const total = Number(countRes.rows[0].total);
  const winners = Number(winnersRes.rows[0].winners);


  if (total === 1 && winners === 1) {
    await db.query(
      `
      UPDATE tournaments
      SET winner_id = $1, status = 'finished'
      WHERE id = $2
      `,
      [winner_id, tournament_id]
    );

    return res.json({
      message: "Tournament finished",
      tournament_winner: winner_id
    });
  }

  res.json({ message: "Winner saved" });
});

//GENERATE NEXT ROUND

router.post("/next-round/:tournamentId",adminAuth, async (req, res) => {
  const { tournamentId } = req.params;

  const roundRes = await db.query(
    `
    SELECT MAX(round) AS last_round
    FROM matches
    WHERE tournament_id = $1
    `,
    [tournamentId]
  );

  const lastRound = roundRes.rows[0].last_round;

  const winnersRes = await db.query(
    `
    SELECT winner_id
    FROM matches
    WHERE tournament_id = $1 AND round = $2
    `,
    [tournamentId, lastRound]
  );

  if (winnersRes.rows.some(r => r.winner_id === null)) {
    return res.status(400).json({
      message: "Finish current round first"
    });
  }

  const players = winnersRes.rows.map(r => r.winner_id);

  if (players.length === 1) {
    return res.json({
      message: "Tournament finished",
      winner_id: players[0]
    });
  }

  const nextRound = lastRound + 1;

  for (let i = 0; i < players.length; i += 2) {
    await db.query(
      `
      INSERT INTO matches (tournament_id, player1_id, player2_id, round)
      VALUES ($1, $2, $3, $4)
      `,
      [tournamentId, players[i], players[i + 1], nextRound]
    );
  }

  res.json({ message: `Round ${nextRound} created` });
});

export default router;
