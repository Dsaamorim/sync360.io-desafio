const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Configuração do banco de dados
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'R@andY0rTon1990!@#$%',
  database: 'perfil_usuario'
});

// Conectar ao MySQL
db.connect(err => {
  if (err) throw err;
  console.log('Conectado ao MySQL');
});

// GET User Endpoint
app.get('/api/usuario', (req, res) => {
  db.query('SELECT * FROM usuarios WHERE id = 1', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results[0] || {
      id: 1,
      nome: 'Nome padrão',
      idade: null,
      rua: '',
      bairro: '',
      cidade: '',
      estado: '',
      biografia: '',
      imagem_perfil: ''
    });
  });
});

// UPDATE User Endpoint
app.put('/api/usuario', (req, res) => {
  const { nome, idade, rua, bairro, cidade, estado, biografia, imagem_perfil } = req.body;
  
  db.query(
    `UPDATE usuarios SET 
      nome = ?, 
      idade = ?, 
      rua = ?, 
      bairro = ?, 
      cidade = ?, 
      estado = ?, 
      biografia = ?, 
      imagem_perfil = ? 
     WHERE id = 1`,
    [nome, idade, rua, bairro, cidade, estado, biografia, imagem_perfil],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Usuário atualizado com sucesso!' });
    }
  );
});

app.listen(3000, () => {
  console.log('Backend rodando em http://localhost:3000');
});