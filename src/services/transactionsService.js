import * as transactionsRepository from '../repositories/transactionRepository.js';

async function get(token) {
    return await transactionsRepository.get(token);
}

async function post({userId,entry,value,description}) {
    return await transactionsRepository.insert({userId,entry,value,description});
}

export {
    get,
    post,
}