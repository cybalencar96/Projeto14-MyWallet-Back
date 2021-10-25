import connection from "../database/index.js"
import { transactionSchema } from "../schemas/transactions.js"
import db from "../database/database.js"

async function getTransactions(req,res) {
    const token = req.headers.authorization?.replace('Bearer ','')
    if (!token) return res.sendStatus(400)
    
    try {
        const user = await db.findLoggedUser(token)
        if (user.rowCount === 0) return res.status(401).send('user not logged in')

        const result = await db.getTransactions(token)
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

    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) return res.status(400).send('missing token')

    const { error } = transactionSchema.validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    try {
        const user = await db.findLoggedUser(token)
        if (!user.rows[0]) return res.status(401).send('user not logged')

        await db.postTransaction(user.rows[0].id,entry,value,description);
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