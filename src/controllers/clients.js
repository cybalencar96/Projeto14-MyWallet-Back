import bcrypt from 'bcrypt'
import connection from '../database/database.js'
import {signInSchema, signUpSchema} from '../schemas/clients.js'

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
        const existingEmail = await connection.query(`SELECT * FROM clients WHERE email = $1`, [email])
        if (existingEmail.rowCount) return res.status(401).send('email in use')

        const hash = bcrypt.hashSync(password,12)

        await connection.query(`
            INSERT INTO clients 
                (name,email,password) 
            VALUES ($1,$2,$3)
        `,[name,email,hash])

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
        const result = await connection.query(`SELECT * FROM clients WHERE email = $1`,[email])
        if (!result.rowCount) return res.status(400).send('email inválido')

        const isValidPassword = bcrypt.compareSync(password, result.rows[0].password)

        if (!isValidPassword) return res.status(401).send('senha inválida')

        const user = {
            id: result.rows[0].id,
            name:result.rows[0].name,
        }
        res.send(user)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export {
    signUpUser,
    signInUser
}