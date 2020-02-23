import request from 'supertest'

import app from '../../src/app'
import factory from '../util/factories'

import truncate from '../util/truncate'

describe('Authentication', () => {
    beforeEach( async () => {
        await truncate()
    })

    it('should authenticate with valid credentials', async () => {
        const user = await factory.create('User', {
            password: '123456'
        })

        const response = await request(app)
            .post('/sessions')
            .send({
                email: user.email,
                password: '123456'
            })
        
        expect(response.status).toBe(200)
    })

    it('should not authenticate with invalid credentials' , async () => {
        const user = await factory.create('User')

        const response = await request(app)
            .post('/sessions')
            .send({
                email: user.email,
                password: '123123'
            })
        
        expect(response.status).toBe(401)
    })

    it('should not authenticated with invalid email', async () => {
        await factory.create('User')

        const response = await request(app)
            .post('/sessions')
            .send({
                email: 'test@email.com',
                password: '123123'
            })
        
        expect(response.status).toBe(401)
    })

    it('should return jwt token when authenticated', async () => {
        const user = await factory.create('User', {
            password: '123456'
        })

        const response = await request(app)
            .post('/sessions')
            .send({
                email: user.email,
                password: '123456'
            })

        expect(response.body).toHaveProperty('token')
    })

    it('should be able to access private routes when authenticated', async () => {
        const user = await factory.create('User')

        const response = await request(app)
            .get('/dashboard')
            .set('Authorization', `Bearer ${user.generateToken()}`)

        expect(response.status).toBe(200)
    })

    it('should not be able to access private routes without jwt token', async () => {
        const response = await request(app)
            .get('/dashboard')

        expect(response.status).toBe(401)
    })

    it('should not be able to access private routes with ivalid jwt token', async () => {
        const response = await request(app)
            .get('/dashboard')
            .set('Authorization', `Bearer 123456`)

        expect(response.status).toBe(401)
    })
})