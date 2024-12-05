app.put('/profile', isAuthenticated, async (req, res) => {
    const userId = req.session.user.id;
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `UPDATE users SET username = ?, password = ? WHERE id = ?`;
    db.query(sql, [username, hashedPassword, userId], (err, result) => {
        if (err) throw err;
        res.send('Profil mis à jour.');
    });
});
