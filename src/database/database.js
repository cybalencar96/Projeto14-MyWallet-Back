import connection from '.'
import bcrypt from 'bcrypt'
import {v4 as uuid} from 'uuid'

async function insertUser(user) {
    const hash = bcrypt.hashSync(user.password, 12)
    const userId = uuid()
    return await connection.query(`
            INSERT INTO users (user_id,email,name,password) 
            VALUES ($1,$2,$3,$4)
        `,[userId,user.email,user.name,hash])
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

async function findUserByEmail(user_email) {
    return await connection.query(`
            SELECT * FROM users WHERE email = $1
        `,[user_email])
}

async function deleteAllData() {
    await connection.query('DELETE FROM users;')
    await connection.query('DELETE FROM sessions;')
    await connection.query('DELETE FROM transactions;')
}

const db = {
    insertUser,
    deleteUser,
    findUserByEmail,
    deleteAllData,
    insertSession
}

export default db