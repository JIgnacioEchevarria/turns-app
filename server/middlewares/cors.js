import cors from 'cors'
import { CorsError } from '../errors.js'

export const corsMiddleware = () => cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:4000',
      'http://localhost:5173',
      'https://jieturns.vercel.app'
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new CorsError('Not allowed by CORS'))
  },
  credentials: true
})
