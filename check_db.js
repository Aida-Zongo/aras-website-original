
import Database from 'better-sqlite3';
const db = new Database('sqlite.db');

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', tables);

if (tables.length === 0) {
    console.error("No tables found!");
    process.exit(1);
} else {
    console.log("Database initialized correctly.");
}
