require('dotenv').config();
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

console.log('Senha carregada:', process.env.DB_PASS ? '[OK]' : '[FALHOU]');
const caCertPath = path.join(__dirname, 'ca.pem');
const caCert = fs.readFileSync(caCertPath).toString();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: true,
        ca: caCert,
      }
    },
    logging: true,
  }
);

// Modelo de Usuário
const User = sequelize.define('usuarios', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  uid: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  temp_preferida: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  lumi_preferida: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false,
  freezeTableName: true
});

// Rota de consulta
app.get('/consulta', async (req, res) => {
  const { uid } = req.query;
  
  if (!uid) {
    return res.status(400).send('UID é necessário');
  }

  try {
    const user = await User.findOne({ where: { uid } });

    if (!user) {
      return res.status(404).send('Usuário não encontrado');
    }

    res.json({
      nome: user.nome,
      temp_preferida: user.temp_preferida,
      lumi_preferida: user.lumi_preferida
    });
  } catch (error) {
    console.error('Erro ao consultar usuário:', error);
    res.status(500).send('Erro ao consultar o banco de dados');
  }
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado ao MySQL com Sequelize!');
  } catch (error) {
    console.error('❌ Erro ao conectar:', error);
  }
}

testConnection();

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});