
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const db = new Database('sqlite.db');
const migrationFile = path.join(process.cwd(), 'drizzle', '0000_bumpy_doctor_octopus.sql');

try {
    const sql = fs.readFileSync(migrationFile, 'utf-8');
    db.exec(sql);
    console.log("Migration applied successfully!");
} catch (err) {
    if (err.message.includes('already exists')) {
        console.log("Migration skipped: Tables already exist.");
        process.exit(0);
    }
    console.error("Migration failed:", err);
    process.exit(1);
}
