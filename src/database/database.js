import pg from 'pg'

const { Pool } = pg

const connection = new Pool({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    database: 'my_wallet',
    password: '33150602'
})

export default connection

