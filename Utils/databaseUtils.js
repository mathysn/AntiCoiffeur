const fs = require('fs');
const path = require('path');

const serverConfig = path.join(__dirname, '..', 'Database', 'serverConfig.json');
const userStats = path.join(__dirname, '..', 'Database', 'userStats.json');

function readDatabase(db) {
    let dbChoice = "";
    switch (db) {
        case 'serverConfig':
            dbChoice = serverConfig;
            break;
        case 'userStats':
            dbChoice = userStats;
            break;
        default:
            console.error("Database not found");
            break;
    }
    if (!fs.existsSync(dbChoice)) {
        fs.writeFileSync(dbChoice, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(dbChoice, 'utf8'));
}

function writeDatabase(db, data) {
    let dbChoice = "";
    switch (db) {
        case 'serverConfig':
            dbChoice = serverConfig;
            break;
        case 'userStats':
            dbChoice = userStats;
            break;
        default:
            break;
    }
    fs.writeFileSync(dbChoice, JSON.stringify(data, null, 4));
}

module.exports = { readDatabase, writeDatabase };