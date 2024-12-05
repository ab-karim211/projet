app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO users (username, password, role) VALUES (?, ?, 'user')`;
    db.query(sql, [username, hashedPassword], (err, result) => {
        if (err) throw err;
        res.send('Inscription réussie. Connectez-vous maintenant.');
    });
});
