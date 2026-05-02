
import Database from 'better-sqlite3';
const db = new Database('sqlite.db');

const rows = db.prepare('SELECT * FROM membershipSubmissions').all();
console.log('Membership Submissions:', rows);
