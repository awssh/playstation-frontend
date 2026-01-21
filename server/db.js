import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pg;

const pgclient = new Client({
  connectionString: process.env.DATABASE_URL,
});

pgclient.connect()
  .then(() => console.log("PostgreSQL connected"))
  .catch(err => {
    console.error("PostgreSQL connection error:", err);
    process.exit(1);
  });

export default pgclient;
