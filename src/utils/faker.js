import faker from 'faker-br'

function getFakeName() {
    return faker.name.findName()
}

function getFakeEmail() {
    return faker.internet.email()
}

function getFakePassword() {
    return faker.internet.password()
}

function getFakeUUID() {
    return faker.random.uuid();
}

function getFakeUsers() {
    const arrUsers = []
    for (let i = 0; i < 10; i++) {
        arrUsers.push({
            user_id: getFakeUUID(),
            email: getFakeEmail().toLowerCase(),
            password: getFakePassword(),
            name: getFakeName()
        })
    }
    return arrUsers
}
 


console.log(getFakeUUID())
export {
    getFakeUsers,
    getFakeName,
    getFakeEmail,
    getFakePassword,
    getFakeUUID
}