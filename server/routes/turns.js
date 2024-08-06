import { Router } from 'express'
import { TurnController } from '../controllers/turn.js'
import { isAdmin, validateAccessToken } from '../utils/authorization.js'

export const createTurnRouter = ({ turnModel }) => {
  const turnsRouter = Router()
  const turnController = new TurnController({ turnModel })

  /**
   * @swagger
   * components:
   *  securitySchemes:
   *    cookieAuth:
   *      type: apiKey
   *      in: cookie
   *      name: access_token
   *  schemas:
   *    Turn:
   *      type: object
   *      properties:
   *        id_turn:
   *          type: string
   *          format: uuid
   *        date_time:
   *          type: string
   *          format: date-time
   *        available:
   *          type: boolean
   *          default: true
   *        user_id:
   *          type: string
   *          format: uuid
   *        service_id:
   *          type: string
   *          format: uuid
   *      required:
   *        - date_time
   *      example:
   *        id_turn: "545d029b-0b2c-4099-9b91-c3a9dc6b1231"
   *        date_time: "2024-08-06T12:30:00Z"
   *        available: true
   *        user_id: "123e4567-e89b-12d3-a456-426614174000"
   *        service_id: "987e6543-e21b-34d5-b678-123456789abc"
  */

  turnsRouter.get('/:date/registered', validateAccessToken, isAdmin, turnController.getAll)
  turnsRouter.get('/user', validateAccessToken, turnController.getUserTurns)
  turnsRouter.get('/:date/available', turnController.getTurnsByDate)
  turnsRouter.post('/', validateAccessToken, isAdmin, turnController.configureCalendar)
  turnsRouter.patch('/', validateAccessToken, turnController.request)
  turnsRouter.patch('/:id/status', validateAccessToken, turnController.cancel)

  return turnsRouter
}
