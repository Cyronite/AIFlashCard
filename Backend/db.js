import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  user: 'Cyronite',
  host: 'localhost',
  database: 'mydatabase',
  password: 'password',
  port: 5432,
});

