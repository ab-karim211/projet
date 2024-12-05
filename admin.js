const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'user_management'
});


db.connect((err) => {
    if (err) throw err;
    console.log('Connecté à la base de données MySQL');
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: true
}));


const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    } else {
        return res.status(403).send('Accès refusé.');
    }
};


const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        return res.status(401).send('Veuillez vous connecter.');
    }
};

app.post('/admin/users', isAdmin, async (req, res) => {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    db.query(sql, [username, hashedPassword, role], (err, result) => {
        if (err) throw err;
        res.send('Utilisateur ajouté avec succès.');
    });
});

app.put('/admin/users/:id', isAdmin, (req, res) => {
    const { username, password, role } = req.body;
    const userId = req.params.id;
    const sql = `UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?`;
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) throw err;
        db.query(sql, [username, hashedPassword, role, userId], (err, result) => {
            if (err) throw err;
            res.send('Utilisateur modifié avec succès.');
        });
    });
});

app.delete('/admin/users/:id', isAdmin, (req, res) => {
    const userId = req.params.id;
    const sql = `DELETE FROM users WHERE id = ?`;
    db.query(sql, [userId], (err, result) => {
        if (err) throw err;
        res.send('Utilisateur supprimé avec succès.');
    });
});

app.put('/users/me', isAuthenticated, (req, res) => {
    const { username, password } = req.body;
    const userId = req.session.user.id;
    const sql = `UPDATE users SET username = ?, password = ? WHERE id = ?`;
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) throw err;
        db.query(sql, [username, hashedPassword, userId], (err, result) => {
            if (err) throw err;
            res.send('Vos informations personnelles ont été modifiées.');
        });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = `SELECT * FROM users WHERE username = ?`;
    db.query(sql, [username], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            const user = results[0];
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    req.session.user = { id: user.id, role: user.role };
                    res.send('Connexion réussie.');
                } else {
                    res.status(401).send('Mot de passe incorrect.');
                }
            });
        } else {
            res.status(404).send('Utilisateur non trouvé.');
        }
    });
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.send('Déconnecté avec succès.');
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
