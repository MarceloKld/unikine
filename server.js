const express = require('express');
const app = express();
const cors = require('cors');
const importRoute = require('./routes/importRoute');
const path = require('path');

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', importRoute);
app.use(express.json());
app.use(cors());

require('./db');

app.get('/', (req, res) => {
    res.send('Serveur Université actif ✅');
});

app.listen(3000, () => {
    console.log('Serveur lancé sur http://localhost:3000');
});

