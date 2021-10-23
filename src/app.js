import express from 'express'
import cors from 'cors'
import { 
    getTransactions,
    postTransaction
} from './controllers/transactions.js'
import {
    signInUser,
    signUpUser,
    getUser,
    logOutUser
} from './controllers/users.js'

const app = express()

app.use(express.json())
app.use(cors())

app.get('/alive', (req,res) => res.send("I'm alivee!!"))

// TRANSACTIONS
app.get('/transactions', getTransactions)
app.post('/transactions', postTransaction)

// CLIENTS
app.post('/sign-up', signUpUser)
app.post('/sign-in', signInUser)
app.get('/log-out', logOutUser)
app.get('/user', getUser)

export default app;