import connection from './index.js'
import bcrypt from 'bcrypt'
import {v4 as uuid} from 'uuid'

async function insertUser(user) {

    const {
        name,
        email,
        password
    } = user

    const hash = bcrypt.hashSync(password, 12)
    const userId = uuid()

    return await connection.query(`
            INSERT INTO users (user_id,email,name,password) 
            VALUES ($1,$2,$3,$4)
        `,[userId,email,name,hash])
}

async function insertSession(userId) {
    const token = uuid()
    await connection.query(`INSERT INTO sessions (token,user_id) VALUES ($1,$2)`,[token,userId])
    return token
}

async function deleteUser(user_id) {
    return await connection.query(`
            DELETE FROM users WHERE user_id = $1
        `,[user_id])
}

async function logOutUser(token) {
    return await connection.query(`DELETE FROM sessions WHERE token = $1`, [token])
}

async function findUserByEmail(user_email) {
    return await connection.query(`
            SELECT * FROM users WHERE email = $1
        `,[user_email])
}

async function findUserByUserId(user_id) {
    return await connection.query(`
            SELECT * FROM users WHERE user_id = $1
        `,[user_id])
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




async function deleteAllData() {
    await connection.query('DELETE FROM users;')
    await connection.query('DELETE FROM sessions;')
    await connection.query('DELETE FROM transactions;')
}

async function getTransactions(token) {
    
    return await (connection.query(`
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
                `, [token]))
}

async function postTransaction(userId,entry,value,description) {
    return await (connection.query(`
            INSERT INTO transactions (
                user_id,
                value,
                description
            ) 
            VALUES ($1,$2,$3)
            `,[userId,entry ? value : value*-1,description]))
}
const db = {

    //USERS
    insertUser,
    deleteUser,
    findUserByEmail,
    deleteAllData,
    insertSession,
    logOutUser,
    findUserByUserId,
    findLoggedUser,

    //TRANSACTIONS
    getTransactions,
    postTransaction
}

export default db