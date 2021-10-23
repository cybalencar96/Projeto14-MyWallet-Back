import bcrypt from 'bcrypt'
import connection from "../database/index.js"
import {signInSchema, signUpSchema} from '../schemas/users.js'
import db from '../database/database.js'

async function signUpUser (req,res) {
    const {
        name,
        email,
        password,
        confirmPassword
    } = req.body
    
    const { error } = signUpSchema.validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    if (!confirmPassword) return res.status(400).send('missing password confirmation')

    try {
        const existingEmail = await db.findUserByEmail(email)
        if (existingEmail.rowCount) {
            return res.status(401).send('email in use')
        }

        await db.insertUser({
            name,
            email,
            password
        })

        res.sendStatus(200)
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
        const result = await db.findUserByEmail(email)
        if (!result.rowCount) return res.status(401).send('Unauthorized')

        const isValidPassword = bcrypt.compareSync(password, result.rows[0].password)
        if (!isValidPassword) return res.status(401).send('senha inválida')
        
        const token = await db.insertSession(result.rows[0].id)
        res.status(200).send({token})
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

async function getUser(req,res) {
    const token = req.headers.authorization?.replace('Bearer ','');

    if (!token) return res.sendStatus(401);

    try {
        const loggedUser = await db.findLoggedUser(token)
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
        await db.logOutUser(token)

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