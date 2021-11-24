import bcrypt from 'bcrypt'
import * as userService from '../services/userService.js'
import pwdComplexity from 'joi-password-complexity'
async function signUpUser (req,res) {
    const {
        name,
        email,
        password,
    } = req.body;

    const complexityOptions = {
        min: 8,
        max: 26,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        requirementCount: 3,
      };

    const pwdError = pwdComplexity(complexityOptions, 'Password').validate(password).error
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
    try {
        const token = res.locals.token;
        const loggedUser = await userService.find({by: 'session', value: token});

        res.send(loggedUser.rows[0])
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

async function logOutUser(req,res) {
    try {
        const token = res.locals.token;
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