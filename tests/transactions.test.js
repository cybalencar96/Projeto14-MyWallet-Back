import '../src/setup.js';
import app from '../src/app.js';
import supertest from 'supertest';
import { getFakeUsers } from '../src/utils/faker.js';
import db from '../src/repositories/database.js';
import * as userService from '../src/services/userService.js';
import * as transactionsService from '../src/services/transactionsService.js';

const fakeUsers = getFakeUsers();

let token; 
let user;

beforeAll(async () => {
    await userService.signup(fakeUsers[0])
    user = await userService.find({ by: 'email', value: fakeUsers[0].email });
    token = await userService.login(user.rows[0].id)
});

afterAll(() => {
    db.endConnection();
});

describe('rota GET /transactions', () => {

    it('should return 400 when not sending token', async () => {
        const result = await supertest(app)
            .get('/transactions');

        expect(result.status).toEqual(400);
    })

    it('should return 401 when token not found', async () => {
        const result = await supertest(app)
            .get('/transactions')
            .set('Authorization', `Bearer token-falsiane`);

        expect(result.status).toEqual(401);
    });

    it('should return 200 when getting transactions', async () => {
        await transactionsService.post({
            userId: user.rows[0].id,
            entry: true,
            value: 30,
            description: 'insert 30',
        });

        await transactionsService.post({
            userId: user.rows[0].id,
            entry: false,
            value: 30,
            description: 'remove 30',
        });

        const result = await supertest(app)
            .get('/transactions')
            .set('Authorization', `Bearer ${token}`)

        
        expect(result.status).toEqual(200);

        const obj = {
            user_id: user.rows[0].id,
            token: token,
            value: expect.anything(),
            date: expect.anything(),
            description: expect.anything()
        };

        result.body.map(transaction => {
            expect(transaction).toEqual(expect.objectContaining(obj));
        });
    });
});

describe('rota POST /transactions', () => {

    it('should return 400 when not sending token', async () => {
        const body = {
            value: 30,
            description: "not much at all",
            entry: true
        }

        const result = await supertest(app)
            .post('/transactions')
            .send(body)

        expect(result.status).toEqual(400)
    })

    it('should return 400 when invalid body', async () => {
        const body = {
            value: 30,
            description: "not much at all",
            entry: 'true-soqnao' // should be boolean
        }
        const result = await supertest(app)
            .post('/transactions')
            .set('Authorization', `Bearer ${token}`)
            .send(body)

        expect(result.status).toEqual(400)
    })

    it('should return 401 when token not found', async () => {
        const body = {
            value: 30,
            description: "not much at all",
            entry: true
        }

        const result = await supertest(app)
            .post('/transactions')
            .set('Authorization', `Bearer token-falsiane`)
            .send(body)

        expect(result.status).toEqual(401)
    })

    it('should return 201 when transaction posted', async () => {
        const body = {
            value: 30,
            description: "not much at all",
            entry: true
        }

        const result = await supertest(app)
            .post('/transactions')
            .set('Authorization', `Bearer ${token}`)
            .send(body)

        expect(result.status).toEqual(201)
    })

})