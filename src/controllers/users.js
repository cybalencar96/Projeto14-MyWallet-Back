import bcrypt from 'bcrypt'
import connection from '../database/database.js'
import {signInSchema, signUpSchema} from '../schemas/users.js'
import {v4 as uuid} from 'uuid'

async function signUpUser (req,res) {
    const {
        name,
        email,
        password,
        confirmPassword
    } = req.body
    console.log(password)
    const { error } = signUpSchema.validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    try {
        const existingEmail = await connection.query(`SELECT * FROM users WHERE email = $1`, [email])
        if (existingEmail.rowCount) return res.status(401).send('email in use')

        const hash = bcrypt.hashSync(password,12)

        await connection.query(`
            INSERT INTO users 
                (user_id,name,email,password) 
            VALUES ($1,$2,$3,$4)
        `,[uuid(), name,email,hash])

        res.send(200)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

async function signInUser (req,res) {
    const {
        email,
        password
    } = req.body

    const { error } = signInSchema.validate(req.body)
    if ( error ) return res.status(400).send(error.details[0].message)

    try {
        const result = await connection.query(`SELECT * FROM users WHERE email = $1`,[email])
        if (!result.rowCount) return res.status(401).send('Unauthorized')

        const isValidPassword = bcrypt.compareSync(password, result.rows[0].password)

        if (!isValidPassword) return res.status(401).send('senha inválida')

        const token = uuid();
        await connection.query(`INSERT INTO sessions (token,user_id) VALUES ($1,$2)`,[token,result.rows[0].id])

        res.send({token})
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

async function getUser(req,res) {
    const token = req.headers.authorization?.replace('Bearer ','');

    if (!token) return res.sendStatus(401);

    try {
        const loggedUser = (await connection.query(`
            SELECT 
                sessions.token,
                users.user_id AS id,
                users.email,
                users.name
            FROM sessions
            JOIN users ON sessions.user_id = users.id 
            WHERE sessions.token = $1
        `, [token])).rows[0]
        
        if (!loggedUser) res.sendStatus(404)

        res.send(loggedUser)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

async function logOutUser(req,res) {
    const token = req.headers.authorization?.replace('Bearer ','')

    if (!token) return res.sendStatus(401)

    try {
        await connection.query(`DELETE FROM sessions WHERE token = $1`, [token])

        res.sendStatus(200)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}


export {
    signUpUser,
    signInUser,
    getUser,
    logOutUser
}