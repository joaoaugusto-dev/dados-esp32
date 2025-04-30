const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());

const db = mysql.createConnection({
  host: "dados-esp32-pi-iot.k.aivencloud.com",
  user: "avnadmin",         // Altere conforme seu usuário
  password: "AVNS_eZrItJbPEllvD89ib-U",         // Altere conforme sua senha
  database: "defaultdb"
});

app.get("/consulta", (req, res) => {
  const uid = req.query.uid;
  if (!uid) return res.status(400).json({ erro: "UID ausente" });

  db.query("SELECT nome FROM usuarios WHERE uid = ?", [uid], (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao consultar o banco" });

    if (results.length > 0) {
      res.json({ nome: results[0].nome });
    } else {
      res.json({ nome: "Desconhecido" });
    }
  });
});

app.listen(3000, () => {
  console.log("API rodando em http://localhost:3000");
});