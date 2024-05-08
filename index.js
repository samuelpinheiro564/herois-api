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

app.get("/heros", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM heros");
    res.json(result.rows);
  } catch (err) {
    console.log(err);
  }
});
app.get("/", async (req, res) => {
    try {
        res.json({ message: "Bem-Vindo a batalha de herois." });
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

app.post("/heros", async (req, res) => {
  const { name, power_values, power_type, hp, attack } = req.body;
  try {
   await pool.query(
      `INSERT INTO heros (name, power_values, power_type, hp , attack ) VALUES ($1, $2,$3,$4,$5)`,
      [name, power_values, power_type, hp, attack]
    );
    res.json({ message: "Heroi cadastrado com sucesso" });
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
   await pool.query(`DELETE FROM batalhas WHERE heros_p = $1`, [id]);
    await pool.query(`DELETE FROM batalhas WHERE heros_s = $1`, [id]);
    const result = await pool.query(`DELETE FROM heros WHERE id = $1`, [id]);
    res.json(result.rows);
  } catch (err) {
    console.log(err);
  }
});

app.get("/batalha/:id1/:id2", async (req, res) => {
  const { id1, id2 } = req.params;
  const batalha_id = Math.floor(Math.random() * 1000);
  let winner;
  try {
      await pool.query(`INSERT INTO batalhas (id, heros_p, heros_s) VALUES ($1, $2, $3)`, [batalha_id, id1, id2]);
      const result = await pool.query(`SELECT obter_vencedor_batalha($1) AS winner`, [batalha_id]);
      winner = result.rows[0].winner;

      // Consulta para obter os dados do vencedor usando o nome do vencedor
      const winnerDataResult = await pool.query(`SELECT * FROM heros WHERE name = $1`, [winner]);
      const winnerData = winnerDataResult.rows[0];

      res.json({ message: `Vencedor da batalha foi ${winner}`, winnerData });
  } catch (err) {
    console.log(err);
  }
});

app.get("/heros/batalhas", async (req, res) => {
  try {
      // Consulta para obter o histórico de batalhas
      const historicoResult = await pool.query(`SELECT * FROM batalhas`);
      const historico = historicoResult.rows;

      // Para cada batalha no histórico, obter os detalhes dos heróis
      for (let i = 0; i < historico.length; i++) {
          const batalha = historico[i];
          const heroiPResult = await pool.query(`SELECT * FROM heros WHERE id = $1`, [batalha.heros_p]);
          const heroiSResult = await pool.query(`SELECT * FROM heros WHERE id = $1`, [batalha.heros_s]);
          batalha.heroi_p = heroiPResult.rows[0];
          batalha.heroi_s = heroiSResult.rows[0];
      }

      res.json({ historico });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erro ao obter o histórico de batalhas" });
  }
});
