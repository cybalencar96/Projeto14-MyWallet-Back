import '../src/setup.js';
import app from '../src/app.js';
import supertest from 'supertest';
import db from '../src/repositories/database.js';
import { getFakeUsers } from '../src/utils/faker.js';
import * as userService from '../src/services/userService';

const fakeUsers = getFakeUsers()
fakeUsers[0].email = 'cintia31@hotmail.com' // mockando email pq lib faker buga ao comparar 2 iguais
fakeUsers[1].email = 'cristiana.reis@yahoo.com' // mockando email pq lib faker buga ao comparar 2 iguais


beforeAll(async () => {
    await db.deleteAllData()
})

afterAll(async () => {
    await db.deleteAllData()
})

//=====================================================================================
//=====================================================================================

describe('POST /sign-up user', () => {

    beforeEach(async () => {
        await userService.signup(fakeUsers[0])
    })

    afterEach(async () => {
        await userService.remove(fakeUsers[0].user_id)
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
        await userService.signup(fakeUsers[0])
    })

    afterEach(async () => {
        await userService.remove(fakeUsers[0].user_id)
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
        expect(result.body).toHaveProperty('token')
    })
})

//=====================================================================================
//=====================================================================================

describe('GET /log-out user', () => {
    let token;

    beforeAll(async () => {
        await userService.signup(fakeUsers[0])
        const user = await userService.find({by: 'email', value: fakeUsers[0].email})
        token = await userService.login(user.rows[0].id)
    })

    afterAll(async () => {
        await db.deleteAllData()
    })
    
    it('should return 401 when not token', async () => {
        const result = await supertest(app).get('/log-out')
        expect(result.status).toEqual(401)
    })

    it('should return 200 when user is logged out', async () => {

        const result = await supertest(app)
            .get('/log-out')
            .set('Authorization', `Bearer ${token}`)
        expect(result.status).toEqual(200)
    })
})

//=====================================================================================
//=====================================================================================


describe('GET /user', () => {
    let token;
    let user;
    beforeAll(async () => {
        await userService.signup(fakeUsers[0]);
        user = await userService.find({by: 'email', value: fakeUsers[0].email});
        token = await userService.login(user.rows[0].id);
    })

    afterAll(async () => {
        await db.deleteAllData()
    })

    it('should return 401 if not token', async () => {
        const result = await supertest(app).get('/user')

        expect(result.status).toEqual(401)
    })

    it('should return 404 if not logged (token not found)', async () => {
        const result = await supertest(app)
                                .get('/user')
                                .set('Authorization',`Bearer token-falso-123`)

        expect(result.status).toEqual(404)
    })

    it('should return 200 if not token', async () => {
        const result = await supertest(app)
                                .get('/user')
                                .set('Authorization',`Bearer ${token}`)

        expect(result.status).toEqual(200)
        expect(result.body).toHaveProperty('token', token)
        expect(result.body).toHaveProperty('id',user.rows[0].id)
        expect(result.body).toHaveProperty('user_id',user.rows[0].user_id)
        expect(result.body).toHaveProperty('email',fakeUsers[0].email)
        expect(result.body).toHaveProperty('name',fakeUsers[0].name)
    })

})