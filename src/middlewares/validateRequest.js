/* eslint-disable consistent-return */
import * as userService from '../services/userService.js';

async function auth(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send('not authenticated');
    }
    
    const result = await userService.find({ by: 'session', value: token });

    if (!result.rowCount) {
        return res.status(401).send('not authenticated');
    }
    res.locals.token = result.rows[0].token
    next();
}

function validateBody(schema) {
    return (req, res, next) => {
        const bodyError = schema.validate(req.body).error;
        if (bodyError) {
            return res.status(400).send(bodyError.details[0].message);
        }
        
        next();
    };
}

export {
    auth,
    validateBody,
};
