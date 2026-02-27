const initSqlJs = require("sql.js");
const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config();


const DB_PATH = path.join(__dirname, "..", "todo.db");

let db;

async function getDb() {
  if (db) return db;
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending'
    )
  `);
  return db;
}

function saveDb() {
  if (db) {
    const data = db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  }
}

/** Reset the cached db instance (used in tests to exercise the file-loading path). */
function resetDb() {
  db = null;
}

module.exports = { getDb, saveDb, resetDb };
