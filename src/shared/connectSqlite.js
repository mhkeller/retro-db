import sqlite3 from 'sqlite3';

export default function connectPg (event, constring) {
	const db = new sqlite3.Database(constring);
	return db;
};
