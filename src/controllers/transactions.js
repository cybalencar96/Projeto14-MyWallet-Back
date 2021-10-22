import connection from "../database/index.js"
import { transactionSchema } from "../schemas/transactions.js"
import joi from 'joi'

async function getTransactions(req,res) {
    const userId = req.params.id
    
    if (!userId) {
        res.sendStatus(400)
    }

    try {
        const result = await connection.query(`
            SELECT 
                user_id AS id,
                value,
                description,
                date 
            FROM transactions 
            WHERE user_id = $1`, [userId])

        res.send(result.rows)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

async function postTransaction(req,res) {
    const {
        value,
        description,
        entry
    } = req.body

    const userId = req.params.id

    const { error } = transactionSchema.validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const idError = joi.object({id: joi.string().required()}).validate({id: userId}).error
    if (idError) return res.status(400).send(idError.details[0].message)

    try {
        await connection.query(`
            INSERT INTO transactions (
                user_id,
                value,
                description
            ) 
            VALUES ($1,$2,$3)
            `,[userId,entry ? value : value*-1,description])

        res.sendStatus(201)
    }
    catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export {
    getTransactions,
    postTransaction,
}