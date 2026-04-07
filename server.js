const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const db = new sqlite3.Database('./fesc_data.db');

app.use(bodyParser.json());
app.use(express.static('public')); // Carpeta para tu HTML/CSS

// Crear tabla de profesores y comentarios si no existe
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS profesores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        materia TEXT,
        calificacion REAL,
        comentario TEXT
    )`);
});

// Ruta para obtener todos los profesores
app.get('/api/profesores', (req, res) => {
    db.all("SELECT * FROM profesores", [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});

// Ruta para agregar una calificación
app.post('/api/calificar', (req, res) => {
    const { nombre, materia, calificacion, comentario } = req.body;
    const query = `INSERT INTO profesores (nombre, materia, calificacion, comentario) VALUES (?, ?, ?, ?)`;
    db.run(query, [nombre, materia, calificacion, comentario], function(err) {
        if (err) return res.status(500).send(err.message);
        res.json({ id: this.lastID });
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});