import bcrypt from 'bcrypt'
import {signInSchema, signUpSchema,validatePassword} from '../schemas/users.js'
import * as userService from '../services/userService.js'

async function signUpUser (req,res) {
    const {
        name,
        email,
        password,
        confirmPassword
    } = req.body;
    
    const { error } = signUpSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const pwdError = validatePassword(password);
    if (pwdError) return res.status(400).send(pwdError?.details.map(detail => detail.message));

    try {
        const existingEmail = await userService.find({by: 'email', value: email});
        if (existingEmail.rowCount) {
            return res.status(401).send('email in use');
        }

        await userService.signup({
            name,
            email,
            password,
        });

        res.sendStatus(200)
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function signInUser (req,res) {
    const {
        email,
        password
    } = req.body

    const { error } = signInSchema.validate(req.body);
    if ( error ) return res.status(400).send(error.details[0].message);

    try {
        const user = await userService.find({by: 'email', value: email});
        if (!user.rowCount) return res.status(401).send('Unauthorized');

        const isValidPassword = bcrypt.compareSync(password, user.rows[0].password);
        if (!isValidPassword) return res.status(401).send('senha inválida');
        
        const token = await userService.login(user.rows[0].id);
        res.status(200).send({token});
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function getUser(req,res) {
    const token = req.headers.authorization?.replace('Bearer ','');

    if (!token) return res.sendStatus(401);

    try {
        const loggedUser = await userService.find({by: 'session', value: token});
        if (!loggedUser.rows[0]) res.sendStatus(404);

        res.send(loggedUser.rows[0])
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

async function logOutUser(req,res) {
    const token = req.headers.authorization?.replace('Bearer ','');

    if (!token) return res.sendStatus(401);

    try {
        await userService.logout(token);

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}


export {
    signUpUser,
    signInUser,
    getUser,
    logOutUser,
}