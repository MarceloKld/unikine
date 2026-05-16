// Importer nos modules
const readExcel = require('./services/excelReader');
const parseStudents = require('./services/gridParser');

// ✅ CONFIGURATION SIMPLE POUR TEST
const config = {
    sheetName: null,
    startRow: 4,

    columns: {
        matricule: "A",
        nom: "B",
        moyenne_annuelle: "CH",
        mention: "CK",
        decision_annuelle: "CL"
    },

    semestres: []
};

// ✅ CHEMIN DE TON FICHIER EXCEL
const filePath = './grille.xlsx'; 
// ⚠️ Mets ton vrai fichier ici (copie-le dans le dossier projet)


// 🔥 TEST
try {

    console.log("📖 Lecture du fichier Excel...");
    const rows = readExcel(filePath, config.sheetName);

    console.log("✅ Fichier chargé !");
    console.log("Nombre total de lignes :", rows.length);

    console.log("🔎 Parsing des étudiants...");
    const students = parseStudents(rows, config);

    console.log("✅ Parsing terminé !");
    console.log("Nombre d'étudiants détectés :", students.length);

    console.log("📌 Premier étudiant détecté :");
    console.log(JSON.stringify(students[0], null, 2));

} catch (error) {
    console.error("❌ ERREUR :", error);
}