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
                    res.send(`Bienvenue, ${user.role}!`);
                } else {
                    res.status(401).send('Mot de passe incorrect.');
                }
            });
        } else {
            res.status(404).send('Utilisateur non trouvé.');
        }
    });
});
