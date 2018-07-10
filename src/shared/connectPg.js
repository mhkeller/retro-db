import pg from 'pg';

export default function connectPg (event, constring) {
  const pool = new pg.Pool({connectionString: constring});

  pool.on('error', err => {
    console.error(err);
    event.sender.send('status', 'error', err.message);
  });

  return pool;
};
