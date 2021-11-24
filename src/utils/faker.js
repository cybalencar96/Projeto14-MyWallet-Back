import faker from 'faker'
import {v4 as uuid} from 'uuid'

function getFakeName() {
    return faker.name.findName()
}

function getFakeEmail() {
    return faker.internet.email()
}

function getFakePassword() {
    return "Fake@1233fake"
}

function getFakeUsers() {
    const arrUsers = []
    for (let i = 0; i < 10; i++) {
        arrUsers.push({
            user_id: uuid(),
            email: getFakeEmail().toLowerCase(),
            password: getFakePassword(),
            name: getFakeName()
        })
    }
    return arrUsers
}
 
export {
    getFakeUsers,
    getFakeName,
    getFakeEmail,
    getFakePassword,
}