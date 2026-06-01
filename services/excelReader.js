const xlsx = require('xlsx');

function colToIndex(letter) {
    return letter.charCodeAt(0) - 65;
}
/**
 * Lire le fichier Excel
 * @param {string} filePath - chemin du fichier
 * @param {string} sheetName - nom de la feuille
 * @returns {Array} tableau 2D (lignes / colonnes)
 */
function readExcel(filePath, sheetName = null) {

    // Charger le fichier
    const workbook = xlsx.readFile(filePath);

    // Si pas de nom donné → prendre la première feuille
    const sheet = sheetName || workbook.SheetNames[0];

    // Récupérer la feuille
    const worksheet = workbook.Sheets[sheet];

    // Convertir en tableau brut
    const rows = xlsx.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: null,
    raw: false   // ✅ IMPORTANT
});

    return rows;
}

module.exports = readExcel;