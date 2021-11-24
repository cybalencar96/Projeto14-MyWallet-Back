import connection from './connection.js'

async function get(token) {
    return await connection.query(`
        SELECT 
            transactions.user_id,
            transactions.value,
            transactions.description,
            transactions.date,
            sessions.token
        FROM transactions 
        JOIN sessions
            ON sessions.user_id = transactions.user_id
        WHERE token = $1
    `, [token])
}

async function insert({userId,entry,value,description}) {
    return await connection.query(`
        INSERT INTO transactions (
            user_id,
            value,
            description
        ) 
        VALUES ($1,$2,$3)
    `,[userId,entry ? value : value*-1,description])
}

export {
    get,
    insert,
}