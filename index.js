require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

app.get("/consulta", (req, res) => {
  const uid = req.query.uid;
  if (!uid) return res.status(400).json({ erro: "UID ausente" });

  db.query("SELECT nome FROM usuarios WHERE uid = ?", [uid], (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro no banco de dados" });

    if (results.length > 0) {
      res.json({ nome: results[0].nome });
    } else {
      res.json({ nome: "Desconhecido" });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});