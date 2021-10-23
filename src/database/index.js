import pg from 'pg'

const { Pool } = pg

const connection = new Pool({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    database: 'my_wallet',
    password: '123456'
})

export default connection
