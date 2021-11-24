import bcrypt from 'bcrypt'
import {v4 as uuid} from 'uuid'
import * as userRepository from '../repositories/userRepository.js'

async function signup(user) {
    const {
        name,
        email,
        password,
    } = user;

    const hash = bcrypt.hashSync(password, 12);
    const userId = uuid();

    const result = await userRepository.insertUser({userId, email, name, hash});
    return result;
}

async function login(userId) {
    const token = uuid();
    await userRepository.insertSession({ userId, token });
    return token;
}

async function remove(userId) {
    return await userRepository.deleteUser(userId);
}

async function logout(token) {
    return await userRepository.deleteSession(token);
}

async function find({by, value}) {
    if (by === 'id') return await userRepository.findUserByUserId(value);
    if (by === 'email') return await userRepository.findUserByEmail(value);
    if (by === 'session') return await userRepository.findLoggedUser(value);
}

export {
    signup,
    login,
    remove,
    logout,
    find,
}