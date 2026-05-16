const readExcel = require('./excelReader');
const parseStudents = require('./gridParser');

async function importExcel(filePath, config) {

    const rows = readExcel(filePath, config.sheetName);

    const students = parseStudents(rows, config);

    console.log(students);

    return {
        total: students.length
    };
}