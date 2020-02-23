import request from 'supertest'
import app from '../../src/app'

describe('User', () => {
    it('should be able to register', async () => {
        const response = await request(app)
            .post('/users')
            .send({
                name: 'Richard',
                email: 'richardpinheiro1992@gmail.com',
                password: '123456'
            })

        expect(response.body).toHaveProperty('id')
    })

    it('should not be able to register with duplicated email', async () => {
        await request(app)
        .post('/users')
        .send({
            name: 'Richard',
            email: 'richardpinheiro1992@gmail.com',
            password: '123456'
        })

        const response = await request(app)
        .post('/users')
        .send({
            name: 'Richard',
            email: 'richardpinheiro1992@gmail.com',
            password: '123456'
        })

        expect(response.status).toBe(400)
    })
})