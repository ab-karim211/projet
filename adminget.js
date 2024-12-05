app.get('/admin/dashboard', isAdmin, (req, res) => {
    const sql = `SELECT id, username, role FROM users`;
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});
