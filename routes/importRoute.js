const express = require('express');
const router = express.Router();
const multer = require('multer');
const importExcel = require('../services/importExcel');

const upload = multer({ dest: 'uploads/' });

router.post('/import', upload.single('file'), async (req, res) => {

    try {

        const result = await importExcel(req.file.path);

        res.json(result);

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: "Erreur importation" });
    }
});

module.exports = router;