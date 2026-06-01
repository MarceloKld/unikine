// ✅ Fonction pour convertir lettre colonne → index
function colToIndex(column) {

    let index = 0;

    for (let i = 0; i < column.length; i++) {
        index = index * 26 + (column.charCodeAt(i) - 64);
    }

    return index - 1;
}

/**
 * Parser les étudiants
 */
function parseStudents(rows, config) {

    const students = [];

    const nomIndex = colToIndex(config.columns.nom);
    const matriculeIndex = colToIndex(config.columns.matricule);
    const mentionIndex = colToIndex(config.columns.mention);
    const decisionIndex = colToIndex(config.columns.decision_annuelle);
    const moyenneIndex = colToIndex(config.columns.moyenne_annuelle);

    const mapping = require('./mappingExcel');

    for (let i = config.startRow - 1; i < rows.length; i++) {

        const row = rows[i];
       

        if (!row || !row[matriculeIndex]) continue;

        const semestre1UEs = Object.values(mapping.semestre1)
    .filter(v => typeof v === "object")
    .map(ue => extractUE(row, rows, ue));

        const semestre2UEs = Object.values(mapping.semestre2)
    .filter(v => typeof v === 'object')
    .map(ue => extractUE(row, rows, ue));

        const student = {

    nom: row[colToIndex(mapping.colNom)],

   semestre1: {
    ues: semestre1UEs,

    totalCredits: row[colToIndex(mapping.semestre1.totalPond)],

    creditsCapitalises: row[colToIndex("AL")], // selon ton mapping C#

    moyenneCategorieA: row[colToIndex("AH")],

    moyenneSemestre: row[colToIndex(mapping.semestre1.moyS1)],

    decision: row[colToIndex(mapping.semestre1.decisionS1)]
},

    semestre2: {
    ues: semestre2UEs,

    totalCredits: row[colToIndex(mapping.semestre2.totalPond)],

    creditsCapitalises: row[colToIndex("BZ")],

    moyenneCategorieA: row[colToIndex("BV")],

    moyenneSemestre: row[colToIndex(mapping.semestre2.moyS2)],

    decision: row[colToIndex(mapping.semestre2.decisionS2)]
},

    annuel: {
    totalAnnuel: row[colToIndex(mapping.annuel.totalAnnuel)],
    moyCategorieA: row[colToIndex("CD")],
    moyAnnuel: row[colToIndex(mapping.annuel.moyAnnuel)],
    pourcentage: row[colToIndex(mapping.annuel.pourcentage)],
    credits: row[colToIndex(mapping.annuel.credits)],
    mention: row[colToIndex(mapping.annuel.mention)],
    decision: row[colToIndex(mapping.annuel.decision)]
}
};

        students.push(student);
    }

    return students;
}

function extractUE(row, rows, UEconfig) {

    const ligneIntitules = rows[0]; // Ligne 1
    const ligneCredits = rows[1];   // Ligne 2

    return {

        code: UEconfig.code,

        // ✅ Intitulé UE = cellule de la colonne CC ligne 1
        intitule: ligneIntitules[colToIndex(UEconfig.CC)],

        // ✅ Catégorie manuelle
        categorie: UEconfig.categorie,

        // ✅ Crédit = ligne 2 colonne CC
        credit: ligneCredits[colToIndex(UEconfig.CC)],

        // ✅ EC automatiques
        ecs: UEconfig.ECs.map(col => ({
            intitule: ligneIntitules[colToIndex(col)],
            note: row[colToIndex(col)]
        })),

        // ✅ Note CC étudiant
        cc: row[colToIndex(UEconfig.CC)],

        // ✅ Cote pondérée
        cotePonderee: row[colToIndex(UEconfig.Pond)]
    };
}

// ✅ TRÈS IMPORTANT : export correct
module.exports = parseStudents;