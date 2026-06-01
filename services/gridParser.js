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
const mapping = require('./mappingExcel');

// ✅ Convertir lettre colonne → index (compatible AA, AB, etc.)
function colToIndex(column) {
    let index = 0;
    for (let i = 0; i < column.length; i++) {
        index = index * 26 + (column.charCodeAt(i) - 64);
    }
    return index - 1;
}

function parseStudents(rows) {

    const students = [];

    // ✅ Parcours des lignes étudiants
    for (let i = mapping.ligneDepartData - 1; i < rows.length; i++) {

        const row = rows[i];

        if (!row) continue;

        const nom = row[colToIndex(mapping.colNom)];

        // ✅ Si pas de nom → ignorer
        if (!nom) continue;

        // ✅ Extraire UE S1
        const semestre1UEs = Object.values(mapping.semestre1)
            .filter(v => typeof v === "object")
            .map(ue => extractUE(row, rows, ue));

        // ✅ Extraire UE S2
        const semestre2UEs = Object.values(mapping.semestre2)
            .filter(v => typeof v === "object")
            .map(ue => extractUE(row, rows, ue));

        // ✅ Construire étudiant
        const student = {

            nom: nom,

            semestre1: {
                ues: semestre1UEs,
                totalCredits: row[colToIndex(mapping.semestre1.totalPond)],
                creditsCapitalises: row[colToIndex("AL")],
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

    const ligneIntitules = rows[0];
    const ligneCredits = rows[1];

    return {

        code: UEconfig.code,

        intitule: ligneIntitules[colToIndex(UEconfig.CC)],

        categorie: UEconfig.categorie,

        // ✅ Crédit total UE
        credit: ligneCredits[colToIndex(UEconfig.CC)],

        ecs: UEconfig.ECs.map(col => ({
            intitule: ligneIntitules[colToIndex(col)],

            // ✅ Crédit EC ajouté ici
            credit: ligneCredits[colToIndex(col)],

            note: row[colToIndex(col)]
        })),

        cc: row[colToIndex(UEconfig.CC)],

        cotePonderee: row[colToIndex(UEconfig.Pond)]
    };
}

// ✅ TRÈS IMPORTANT : export correct
module.exports = parseStudents;