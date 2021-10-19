import express from 'express'
import cors from 'cors'
import { 
    getRegisters,
    postTransaction
} from './controllers/registers.js'
import {
    signInUser,
    signUpUser
} from './controllers/clients.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json())
app.use(cors())

app.get('/alive', (req,res) => {
    res.send("I'm alivee!!")
})

// REGISTERS
app.get('/registers', getRegisters)
app.post('/registers', postTransaction)

// CLIENTS
app.post('/sign-up', signUpUser)
app.post('/sign-in', signInUser)
// TODO --> rota de login clientes com token

app.listen(PORT,() => console.log('Listening back on port ' + PORT))