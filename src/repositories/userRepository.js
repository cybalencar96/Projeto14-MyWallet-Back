import connection from './connection.js'

async function insertUser({userId, email, name, hash}) {

    return await connection.query(`
            INSERT INTO users (user_id,email,name,password) 
            VALUES ($1,$2,$3,$4)
        `,[userId,email,name,hash])
}

async function insertSession({userId, token}) {
    await connection.query(`INSERT INTO sessions (token,user_id) VALUES ($1,$2)`,[token,userId])
    return token
}

async function deleteUser(userId) {
    return await connection.query(`DELETE FROM users WHERE user_id = $1`,[userId]);
}

async function deleteSession(token) {
    return await connection.query(`DELETE FROM sessions WHERE token = $1`, [token])
}

async function findUserByEmail(userEmail) {
    return await connection.query(`
            SELECT * FROM users WHERE email = $1
        `,[userEmail])
}

async function findUserByUserId(userId) {
    return await connection.query(`
            SELECT * FROM users WHERE user_id = $1
        `,[userId])
}

async function findLoggedUser(token) {
        return await connection.query(`
        SELECT 
            sessions.token,
            users.id,
            users.user_id,
            users.email,
            users.name
        FROM sessions
        JOIN users ON sessions.user_id = users.id
        WHERE sessions.token = $1
    `, [token])
}

export {
    insertUser,
    insertSession,
    deleteUser,
    deleteSession,
    findUserByEmail,
    findUserByUserId,
    findLoggedUser,
}