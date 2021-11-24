
import * as transactionsService from '../services/transactionsService.js';
import * as userService from '../services/userService.js';

async function getTransactions(req,res) {
    const token = res.locals.token;

    try {
        const result = await transactionsService.get(token);
        res.send(result.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function postTransaction(req,res) {
    const {
        value,
        description,
        entry
    } = req.body

    try {
        const token = res.locals.token;
        const user = await userService.find({by: 'session', value: token})
        await transactionsService.post({
            userId: user.rows[0].id,
            entry,
            value,
            description
        });

        res.sendStatus(201);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export {
    getTransactions,
    postTransaction,
}