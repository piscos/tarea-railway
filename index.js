const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión
const db = mysql.createPool(process.env.MYSQL_URL);

const initDB = () => {
    const sql = `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    )`;
    db.query(sql, (err) => {
        if (err) console.error("Error creando tabla:", err);
        else console.log("Tabla 'users' lista (creada o ya existía)");
    });
};
initDB();
// ------------------------------------------------

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/usuarios', (req, res) => {
    db.query('SELECT * FROM users ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post('/api/usuarios', (req, res) => {
    db.query('INSERT INTO users (name) VALUES (?)', [req.body.name], (err) => {
        if (err) return res.status(500).send(err);
        res.redirect('/');
    });
});

app.get('/api/usuarios/delete/:id', (req, res) => {
    db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.redirect('/');
    });
});

app.listen(port, "0.0.0.0", () => console.log(`Servidor en puerto ${port}`));
