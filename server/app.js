import express, { json } from 'express'
import { corsMiddleware } from './middlewares/cors.js'
import cookieParser from 'cookie-parser'
import { createTurnRouter } from './routes/turns.js'
import { createServiceRouter } from './routes/service.js'
import { createUserRouter } from './routes/users.js'
import { UserModel } from './models/user.js'
import { ServiceModel } from './models/service.js'
import { TurnModel } from './models/turn.js'
import { setupSwagger } from './swagger.js'

const app = express()

// Middleware
app.use(json())
app.use(corsMiddleware())
app.use(cookieParser())
app.disable('x-powered-by')

// Swagger
setupSwagger(app)

// Rutas de la API
app.use('/api/v1/turns', createTurnRouter({ turnModel: TurnModel }))
app.use('/api/v1/services', createServiceRouter({ serviceModel: ServiceModel }))
app.use('/api/v1/users', createUserRouter({ userModel: UserModel }))

export default app
