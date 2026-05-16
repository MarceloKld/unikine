const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'unikine_db'
});

connection.connect((err) => {
    if (err) {
        console.error('Erreur connexion DB:', err);
    } else {
        console.log('MySQL connecté ✅');
    }
});

module.exports = connection;