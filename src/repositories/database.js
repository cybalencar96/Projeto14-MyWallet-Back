import connection from './connection.js'

async function deleteAllData() {
    await connection.query('DELETE FROM users;')
    await connection.query('DELETE FROM sessions;')
    await connection.query('DELETE FROM transactions;')
}

function endConnection() {
    connection.end();
}

const db = {
    deleteAllData,
    endConnection,
}

export default db