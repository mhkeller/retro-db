import sqlite3 = from 'sqlite3';

export default function loadSqlite (event, filePath) {
  const db = new sqlite3.Database(filePath);

  return db;
};
