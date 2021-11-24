import pg from 'pg'

const { Pool } = pg

let connectionData = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
}

if (process.env.NODE_ENV === 'prod') {
    connectionData = {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    }
}


const connection = new Pool(connectionData);

export default connection;
