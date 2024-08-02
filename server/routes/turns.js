import { Router } from 'express'
import { TurnController } from '../controllers/turn.js'
import { isAdmin, validateAccessToken } from '../utils/authorization.js'

export const createTurnRouter = ({ turnModel }) => {
  const turnsRouter = Router()
  const turnController = new TurnController({ turnModel })

  turnsRouter.get('/:date/registered', validateAccessToken, isAdmin, turnController.getAll)
  turnsRouter.get('/user', validateAccessToken, turnController.getUserTurns)
  turnsRouter.get('/:date/available', turnController.getTurnsByDate)
  turnsRouter.post('/', validateAccessToken, isAdmin, turnController.configureCalendar)
  turnsRouter.patch('/', validateAccessToken, turnController.request)
  turnsRouter.patch('/:id/status', validateAccessToken, turnController.cancel)

  return turnsRouter
}
