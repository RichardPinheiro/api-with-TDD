import { Router } from 'express'

import authMiddleware from '../src/app/middlewares/auth';

import UserController from '../src/app/controllers/UserController'
import SessionController from '../src/app/controllers/SessionController'

const routes = new Router()

routes.post('/sessions', SessionController.authentication)

routes.post('/users', UserController.store)

routes.use(authMiddleware)

routes.get('/dashboard', (req, res) => {
    return res.status(200).send()
})

export default routes
