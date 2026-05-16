const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Serveur Université actif ✅');
});

app.listen(3000, () => {
    console.log('Serveur lancé sur http://localhost:3000');
});