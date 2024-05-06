const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = 4000;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "heroes",
  password: "ds564",
  port: 7007,
});

app.use(express.json());

app.listen(PORT, () => {
  console.log(`funcionando normalmente ${PORT}🚀`);
});

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM heros;");
    res.json(result.rows);
  } catch (err) {
    console.log(err);
  }
});
app.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`SELECT * FROM heros WHERE id =$1`, [id]);
    res.json(result.rows);
  } catch (err) {
    console.log(err);
  }
});
app.get("/name/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const result = await pool.query(`SELECT * FROM heros WHERE name =$1`, [
      name,
    ]);
    res.json(result.rows);
  } catch (err) {
    console.log(err);
  }
});
app.post("/", async (req, res) => {
  const { name, power_values, power_type, hp, attack } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO heros (name, power_values, power_type, hp , attack ) VALUES ($1, $2,$3,$4,$5)`,
      [name, power_values, power_type, hp, attack]
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
  }
});

app.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, power_values, power_type, hp, attack } = req.body;
  try {
    const result = await pool.query(
      `UPDATE heros SET name = $1, power_values = $2, power_type = $3, hp = $4, attack = $5 WHERE id = $6`,
      [name, power_values, power_type, hp, attack, id]
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
  }
});

app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`DELETE FROM heros WHERE id = $1`, [id]);
    res.json(result.rows);
  } catch (err) {
    console.log(err);
  }
});

app.post("/batalha/:id1/:id2", async (req, res) => {
    const { id1, id2 } = req.params;
    const batalha_id = Math.floor(Math.random() * 1000);
    try {
        await pool.query(`INSERT INTO batalhas (id,heros_p, heros_s) VALUES ($1,$2,%3)`, [batalha_id,id1, id2]);
        await pool.query(`SELECTFROM obter_vencedor_batalha($1) `, [batalha_id]);
        res.json({ winner, looser });
    } catch (err) {
      console.log(err);
    }
});

app.get("/batalhas", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM batalhas`);
    res.json(result.rows);
  } catch (err) {
    console.log(err);
  }
});
