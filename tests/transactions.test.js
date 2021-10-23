import app from '../src/app.js'
import supertest from 'supertest'

describe('rota GET /transactions', () => {

    // beforeAll(() => {

    // })

    it('should return 400 when not sending token', async () => {
        const result = await supertest(app)
            .get('/transactions')

        expect(result.status).toEqual(400)
    })

    // it('should return 200 when getting transactions', async () => {
    //     const result = await supertest(app).get('/transactions/id-falso')

    //     expect(result.status).toEqual(404)
    //     expect(result.text).toEqual('user not found')
    // })
})