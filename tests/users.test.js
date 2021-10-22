import app from '../src/app.js'
import supertest from 'supertest'
import connection from '../src/database/index.js'
import db from '../src/database/database.js'
import { getFakeUsers } from '../src/utils/faker.js'

const fakeUsers = getFakeUsers()
fakeUsers[0].email = 'cintia31@hotmail.com' // mockando email pq lib faker buga ao comparar 2 iguais
fakeUsers[0].password = 'mArAiA@1123' // mockando email pq lib faker buga ao comparar 2 iguais
fakeUsers[1].email = 'cristiana.reis@yahoo.com' // mockando email pq lib faker buga ao comparar 2 iguais


afterAll(async () => {
    await connection.query('DELETE FROM users;')
    await connection.query('DELETE FROM sessions;')
    await connection.query('DELETE FROM transactions;')
})

//=====================================================================================
//=====================================================================================

describe('POST /sign-up user', () => {

    beforeEach(async () => {
        await db.insertUser(fakeUsers[0])
    })

    afterEach(async () => {
        await db.deleteUser(fakeUsers[0].user_id)
    })

    it('should return 401 when email already exists', async () => {
        const body = {
            name: fakeUsers[0].name,
            email: fakeUsers[0].email,
            password: fakeUsers[0].password,
            confirmPassword: fakeUsers[0].password
        }
        
        const result = await supertest(app).post('/sign-up').send(body)
        expect(result.status).toEqual(401)
    })

    it('should return 400 when missing confirmPassword', async () => {
        const body = {
            name: fakeUsers[0].name,
            email: fakeUsers[0].email,
            password: fakeUsers[0].password,
            //missing confirmPassword for invalid body
        }
        
        const result = await supertest(app).post('/sign-up').send(body)
        expect(result.status).toEqual(400)
    })

    it('should return 400 when missing other attribute from body', async () => {
        const body = {
            email: fakeUsers[0].email,
            password: fakeUsers[0].password,
            confirmPassword: fakeUsers[0].password
        }
        
        const result = await supertest(app).post('/sign-up').send(body)
        expect(result.status).toEqual(400)
    })

    it('should return 200 when adding user', async () => {
        const body = {
            name: fakeUsers[1].name,
            email: fakeUsers[1].email,
            password: fakeUsers[1].password,
            confirmPassword: fakeUsers[1].password
        }
        
        const result = await supertest(app).post('/sign-up').send(body)
        expect(result.status).toEqual(200)
    })
})

//=====================================================================================
//=====================================================================================

describe('POST /sign-in user', () => {

    beforeAll(async () => {
        await db.deleteAllData();
    })
    
    beforeEach(async () => {
        await db.insertUser(fakeUsers[0])
    })

    afterEach(async () => {
        await db.deleteUser(fakeUsers[0].user_id)
    })

    it('should return 400 when invalid body', async () => {
        const body = {
            email: fakeUsers[0].email,
            //missing passwoord
        }

        const result = await supertest(app).post('/sign-in').send(body)
        expect(result.status).toEqual(400)
    })

    it('should return 401 when email doesnt exists', async () => {
        const body = {
            email: fakeUsers[1].email,
            password: fakeUsers[1].password
        }

        const result = await supertest(app).post('/sign-in').send(body)
        expect(result.status).toEqual(401)
    })

    it('should return 401 when invalid password', async () => {
        const body = {
            email: fakeUsers[0].email,
            password: 'fakeUsers[1].password'
        }

        const result = await supertest(app).post('/sign-in').send(body)
        expect(result.status).toEqual(401)
    })

    it('should return 200 when valid credentials', async () => {
        const body = {
            email: fakeUsers[0].email,
            password: fakeUsers[0].password
        }

        const result = await supertest(app).post('/sign-in').send(body)
        expect(result.status).toEqual(200)
    })
})

// describe('GET /log-out user', () => {
    
// })

// describe('GET /user', () => {
    
// })