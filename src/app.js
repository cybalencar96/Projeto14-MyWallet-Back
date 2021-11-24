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
import {signInSchema, signUpSchema } from './schemas/users.js';
import { transactionSchema } from "./schemas/transactions.js";
import { validateBody, auth } from './middlewares/validateRequest.js';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/alive', (req,res) => res.send("I'm alivee!!"));

// TRANSACTIONS
app.get('/transactions', auth, getTransactions);
app.post('/transactions', auth, validateBody(transactionSchema), postTransaction);

// CLIENTS
app.post('/sign-up', validateBody(signUpSchema),signUpUser);
app.post('/sign-in', validateBody(signInSchema), signInUser);
app.get('/log-out', auth, logOutUser);
app.get('/user', auth, getUser);

export default app;