const express = require('express');
const router = express.Router();
const generatePDF = require('../services/generatePDF');

router.get('/generate/:session_id', async (req, res) => {

    try {

        const result = await generatePDF(req.params.session_id);

        res.json(result);

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: "Erreur génération PDF" });
    }
});

module.exports = router;