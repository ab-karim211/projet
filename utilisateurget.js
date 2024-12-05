app.get('/profile', isAuthenticated, (req, res) => {
    const userId = req.session.user.id;
    const sql = `SELECT username, role FROM users WHERE id = ?`;
    db.query(sql, [userId], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).send('Utilisateur non trouvé.');
        }
    });
});
