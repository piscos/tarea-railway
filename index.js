const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conector usando la variable de Railway
const db = mysql.createPool(process.env.MYSQL_URL);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/usuarios', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post('/api/usuarios', (req, res) => {
    const { name } = req.body;
    db.query('INSERT INTO users (name) VALUES (?)', [name], (err) => {
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


app.listen(port, "0.0.0.0", () => {
    console.log(`Servidor ejecutándose en el puerto ${port}`);
});
