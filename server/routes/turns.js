import { Router } from 'express'
import { TurnController } from '../controllers/turn.js'
import { isAdmin, isAdminOrEmployee, validateAccessToken } from '../utils/authorization.js'

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

  /**
   * @swagger
   *  /api/v1/turns/{date}/registered:
   *    get:
   *      summary: Get requested turns by date
   *      tags: [Turn]
   *      security:
   *        - cookieAuth: []
   *      parameters:
   *        - in: query
   *          name: type
   *          required: true
   *          schema:
   *            type: string
   *            example: "future"
   *          description: Type of turns you want to obtain
   *      responses:
   *        200:
   *          description: A list of turns
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: integer
   *                    example: 200
   *                  statusMessage:
   *                    type: string
   *                    example: "Success"
   *                  data:
   *                    type: array
   *                    items:
   *                      type: object
   *                      properties:
   *                        id_turn:
   *                          type: string
   *                          format: uuid
   *                          example: "ed205999-b6ea-417b-8bfc-a3eb9a603b1a"
   *                        id_user:
   *                          type: string
   *                          format: uuid
   *                          example: "ed203444-b6ea-417b-8bfc-a3eb9a603b1a"
   *                        username:
   *                          type: string
   *                          example: "steveJobs33"
   *                        userEmail:
   *                          type: string
   *                          format: email
   *                          example: "steve33@example.com"
   *                        phone_number:
   *                          type: string
   *                          example: "2578904572"
   *                        id_service:
   *                          type: string
   *                          format: uuid
   *                          example: "ed207111-b6ea-417b-8bfc-a3eb9a603b1a"
   *                        service:
   *                          type: string
   *                          example: "Haircut"
   *                        price:
   *                          type: integer
   *                          example: 2000
   *                        duration:
   *                          type: integer
   *                          example: 45
   *                        date_time:
   *                          type: string
   *                          format: date-time
   *                          example: "2024-08-12 05:00:00"
   *                        date:
   *                          type: string
   *                          format: date
   *                          example: "2024-08-12"
   *                        time:
   *                          type: string
   *                          format: time
   *                          example: "05:00:00"
   *        403:
   *          description: Access not authorized
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: integer
   *                    example: 403
   *                  statusMessage:
   *                    type: string
   *                    example: "Access Not Authorized"
   *        400:
   *          description: Bad Request
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: integer
   *                    example: 400
   *                  statusMessage:
   *                    type: string
   *                    example: "Bad Request"
   *                  error:
   *                    type: string
   *                    example: "Invalid type provided"
   *        404:
   *          description: Turns not found
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: integer
   *                    example: 404
   *                  statusMessage:
   *                    type: string
   *                    example: "Not Found"
   *                  error:
   *                    type: string
   *                    example: "Turns not found"
   *        500:
   *          description: Failed Connection
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: integer
   *                    example: 500
   *                  statusMessage:
   *                    type: string
   *                    example: "Failed Connection"
   *                  error:
   *                    type: string
   *                    example: "Database is not available"
  */
  turnsRouter.get('/registered', validateAccessToken, isAdminOrEmployee, turnController.getAll)

  /**
   * @swagger
   *  /api/v1/turns/user:
   *    get:
   *      summary: Get my turns
   *      tags: [Turn]
   *      security:
   *        - cookieAuth: []
   *      responses:
   *        200:
   *          description: A list of turns
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: integer
   *                    example: 200
   *                  statusMessage:
   *                    type: string
   *                    example: "Success"
   *                  data:
   *                    type: array
   *                    items:
   *                      type: object
   *                      properties:
   *                        id_turn:
   *                          type: string
   *                          format: uuid
   *                          example: "ed205999-b6ea-417b-8bfc-a3eb9a603b1a"
   *                        id_user:
   *                          type: string
   *                          format: uuid
   *                          example: "ed203444-b6ea-417b-8bfc-a3eb9a603b1a"
   *                        username:
   *                          type: string
   *                          example: "steveJobs33"
   *                        id_service:
   *                          type: string
   *                          format: uuid
   *                          example: "ed207111-b6ea-417b-8bfc-a3eb9a603b1a"
   *                        service:
   *                          type: string
   *                          example: "Haircut"
   *                        duration:
   *                          type: integer
   *                          example: 45
   *                        price:
   *                          type: integer
   *                          example: 2000
   *                        date_time:
   *                          type: string
   *                          format: date-time
   *                          example: "2024-08-12 05:00:00"
   *                        date:
   *                          type: string
   *                          format: date
   *                          example: "2024-08-12"
   *                        time:
   *                          type: string
   *                          format: time
   *                          example: "05:00:00"
   *        403:
   *          description: Access not authorized
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: integer
   *                    example: 403
   *                  statusMessage:
   *                    type: string
   *                    example: "Access Not Authorized"
   *        400:
   *          description: Bad Request
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: integer
   *                    example: 400
   *                  statusMessage:
   *                    type: string
   *                    example: "Bad Request"
   *                  error:
   *                    type: string
   *                    example: "Invalid user ID provided"
   *        404:
   *          description: Turns not found
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: integer
   *                    example: 404
   *                  statusMessage:
   *                    type: string
   *                    example: "Not Found"
   *                  error:
   *                    type: string
   *                    example: "Turns not found"
   *        500:
   *          description: Failed Connection
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: integer
   *                    example: 500
   *                  statusMessage:
   *                    type: string
   *                    example: "Failed Connection"
   *                  error:
   *                    type: string
   *                    example: "Database is not available"
  */
  turnsRouter.get('/user', validateAccessToken, turnController.getUserTurns)

  /**
   * @swagger
   *  /api/v1/turns/{date}/available:
   *    get:
   *      summary: Get available turns by date
   *      tags: [Turn]
   *      parameters:
   *        - in: path
   *          name: date
   *          required: true
   *          schema:
   *            type: string
   *            format: date-time
   *            example: "2024-08-06"
   *          description: Date from which you want to obtain the turns
   *      responses:
   *        200:
   *          description: A list of turns
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: integer
   *                    example: 200
   *                  statusMessage:
   *                    type: string
   *                    example: "Success"
   *                  data:
   *                    type: array
   *                    items:
   *                      type: object
   *                      properties:
   *                        id_turn:
   *                          type: string
   *                          format: uuid
   *                          example: "ed205999-b6ea-417b-8bfc-a3eb9a603b1a"
   *                        date_time:
   *                          type: string
   *                          format: date-time
   *                          example: "2024-08-12 05:00:00"
   *                        date:
   *                          type: string
   *                          format: date
   *                          example: "2024-08-12"
   *                        time:
   *                          type: string
   *                          format: time
   *                          example: "05:00:00"
   *        400:
   *          description: Bad Request
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: integer
   *                    example: 400
   *                  statusMessage:
   *                    type: string
   *                    example: "Bad Request"
   *                  error:
   *                    type: string
   *                    example: "Invalid date format"
   *        404:
   *          description: Turns not found
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: integer
   *                    example: 404
   *                  statusMessage:
   *                    type: string
   *                    example: "Not Found"
   *                  error:
   *                    type: string
   *                    example: "Turns not found"
   *        500:
   *          description: Failed Connection
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: integer
   *                    example: 500
   *                  statusMessage:
   *                    type: string
   *                    example: "Failed Connection"
   *                  error:
   *                    type: string
   *                    example: "Database is not available"
  */
  turnsRouter.get('/:date/available', turnController.getTurnsByDate)

  /**
   * @swagger
   *  /api/v1/turns:
   *    post:
   *      summary: Configure calendar
   *      tags: [Turn]
   *      security:
   *        - cookieAuth: []
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                type: object
   *                properties:
   *                  dayIndex:
   *                    type: integer
   *                    example: 1
   *                    description: Index of the day in the week (0-6, where 0 is Sunday and 6 is Saturday)
   *                  day:
   *                    type: string
   *                    example: "Monday"
   *                    description: Name of the day
   *                  checked:
   *                    type: boolean
   *                    example: true
   *                    description: Indicates if the day is active
   *                  timeSlots:
   *                    type: array
   *                    items:
   *                      type: object
   *                      properties:
   *                        start:
   *                          type: string
   *                          format: time
   *                          example: "09:00"
   *                          description: Start time of the slot
   *                        end:
   *                          type: string
   *                          format: time
   *                          example: "15:00"
   *                          description: End time of the slot
   *              required:
   *                - dayIndex
   *                - day
   *                - checked
   *                - timeSlots
   *      responses:
   *        200:
   *          description: Calendar successfully configured
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: integer
   *                    example: 200
   *                  statusMessage:
   *                    type: string
   *                    example: "Success"
   *        422:
   *          description: Validation error
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: integer
   *                    example: 422
   *                  statusMessage:
   *                    type: string
   *                    example: "Validation Error"
   *                  error:
   *                    type: array
   *                    items:
   *                      type: object
   *                      properties:
   *                        field:
   *                          type: string
   *                          example: "timeSlots"
   *                        message:
   *                          type: string
   *                          example: "Invalid time slots"
   *        400:
   *          description: Bad Request
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: integer
   *                    example: 400
   *                  statusMessage:
   *                    type: string
   *                    example: "Syntax Error"
   *                  error:
   *                    type: string
   *                    example: "Invalid object JSON provided"
   *        500:
   *          description: Failed Connection
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: integer
   *                    example: 500
   *                  statusMessage:
   *                    type: string
   *                    example: "Failed Connection"
   *                  error:
   *                    type: string
   *                    example: "Database is not available"
  */
  turnsRouter.post('/', validateAccessToken, isAdmin, turnController.configureCalendar)

  /**
   * @swagger
   *  /api/v1/turns:
   *    patch:
   *      summary: Request turn
   *      tags: [Turn]
   *      security:
   *        - cookieAuth: []
   *      parameters:
   *        - in: query
   *          name: turnId
   *          required: true
   *          schema:
   *            type: string
   *            format: uuid
   *            example: "ed205999-b6ea-417b-8bfc-a3eb9a603b1a"
   *          description: Unique ID of turn
   *        - in: query
   *          name: idService
   *          required: true
   *          schema:
   *            type: string
   *            format: uuid
   *            example: "ed205999-b6ea-417b-8bfc-a3eb9a603b1a"
   *          description: Unique ID of service
   *      responses:
   *        200:
   *          description: Turn requested successfully
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: integer
   *                    example: 200
   *                  statusMessage:
   *                    type: string
   *                    example: "Success"
   *                  data:
   *                    type: object
   *                    properties:
   *                      date_time:
   *                        type: string
   *                        format: date-time
   *                        example: "2024-08-12 05:00:00"
   *                      date:
   *                        type: string
   *                        format: date
   *                        example: "2024-08-12"
   *                      time:
   *                        type: string
   *                        format: time
   *                        example: "05:00:00"
   *                      id_turn:
   *                        type: string
   *                        format: uuid
   *                        example: "ed205999-b6ea-417b-8bfc-a3eb9a603b1a"
   *                      id_user:
   *                        type: string
   *                        format: uuid
   *                        example: "ed208811-b6ea-417b-8bfc-a3eb9a603b1a"
   *                      id_service:
   *                        type: string
   *                        format: uuid
   *                        example: "ed202000-b6ea-417b-8bfc-a3eb9a603b1a"
   *                      email:
   *                        type: string
   *                        format: email
   *                        example: "jDutch@example.com"
   *                      name:
   *                        type: string
   *                        example: "jhonDutch"
   *                      phoneNumber:
   *                        type: string
   *                        example: "2349089078"
   *                      service:
   *                        type: string
   *                        example: "Haircut"
   *                      duration:
   *                        type: integer
   *                        example: 30
   *                      price:
   *                        type: integer
   *                        example: 2000
   *        403:
   *          description: Access not authorized
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: integer
   *                    example: 403
   *                  statusMessage:
   *                    type: string
   *                    example: "Access Not Authorized"
   *        400:
   *          description: Bad Request
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: integer
   *                    example: 400
   *                  statusMessage:
   *                    type: string
   *                    example: "Bad Request"
   *                  error:
   *                    type: string
   *                    example: "Invalid service ID provided"
   *        404:
   *          description: Turn not available
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: integer
   *                    example: 404
   *                  statusMessage:
   *                    type: string
   *                    example: "Not Available"
   *                  error:
   *                    type: string
   *                    example: "Turn not available"
   *        500:
   *          description: Failed Connection
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: integer
   *                    example: 500
   *                  statusMessage:
   *                    type: string
   *                    example: "Failed Connection"
   *                  error:
   *                    type: string
   *                    example: "Database is not available"
  */
  turnsRouter.patch('/', validateAccessToken, turnController.request)

  /**
   * @swagger
   *  /api/v1/turns/{id}/status:
   *    patch:
   *      summary: Cancel turn
   *      tags: [Turn]
   *      security:
   *        - cookieAuth: []
   *      parameters:
   *        - in: path
   *          name: id
   *          required: true
   *          schema:
   *            type: string
   *            format: uuid
   *            example: "ed205999-b6ea-417b-8bfc-a3eb9a603b1a"
   *          description: Unique ID of the turn you want to cancel
   *      responses:
   *        200:
   *          description: Turn canceled successfully
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: integer
   *                    example: 200
   *                  statusMessage:
   *                    type: string
   *                    example: "Success"
   *        403:
   *          description: Access not authorized
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: integer
   *                    example: 403
   *                  statusMessage:
   *                    type: string
   *                    example: "Access Not Authorized"
   *        400:
   *          description: Bad Request
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: integer
   *                    example: 400
   *                  statusMessage:
   *                    type: string
   *                    example: "Bad Request"
   *                  error:
   *                    type: string
   *                    example: "Invalid turn ID provided"
   *        401:
   *          description: Unauthorized error
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: integer
   *                    example: 401
   *                  statusMessage:
   *                    type: string
   *                    example: "Unauthorized"
   *                  error:
   *                    type: string
   *                    example: "You cannot cancel the turn because the time limit has been exceeded"
   *        404:
   *          description: Turn not found
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: integer
   *                    example: 404
   *                  statusMessage:
   *                    type: string
   *                    example: "Not Found"
   *                  error:
   *                    type: string
   *                    example: "Turn not found"
   *        500:
   *          description: Failed Connection
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: integer
   *                    example: 500
   *                  statusMessage:
   *                    type: string
   *                    example: "Failed Connection"
   *                  error:
   *                    type: string
   *                    example: "Database is not available"
  */
  turnsRouter.patch('/:id/status', validateAccessToken, turnController.cancel)

  return turnsRouter
}
