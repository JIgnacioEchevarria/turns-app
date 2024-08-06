import { Router } from 'express'
import { UserController } from '../controllers/user.js'
import { isAdmin, validateAccessToken } from '../utils/authorization.js'

export const createUserRouter = ({ userModel }) => {
  const usersRouter = Router()

  const userController = new UserController({ userModel })

  /**
   * @swagger
   * components:
   *  securitySchemes:
   *    cookieAuth:
   *      type: apiKey
   *      in: cookie
   *      name: access_token
   *  schemas:
   *    User:
   *      type: object
   *      properties:
   *        id_user:
   *          type: string
   *          format: uuid
   *        name:
   *          type: string
   *        email:
   *          type: string
   *          format: email
   *        password:
   *          type: string
   *          format: password
   *        phone_number:
   *          type: string
   *        role:
   *          type: string
   *          default: "client"
   *      required:
   *        - name
   *        - email
   *        - password
   *        - phone_number
   *      example:
   *        id_user: "545d029b-0b2c-4099-9b91-c3a9dc6b1231"
   *        name: "OscarLopez33"
   *        email: "example@example.com"
   *        password: "password123"
   *        phone_number: "2678902345"
   *        role: "client"
  */

  /**
   * @swagger
   *  /api/v1/users:
   *    get:
   *      summary: Get all users
   *      tags: [User]
   *      security:
   *        - cookieAuth: []
   *      responses:
   *        200:
   *          description: A list of all users
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
   *                      $ref: '#/components/schemas/User'
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
   *        404:
   *          description: No users found
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
   *                    example: "No users found"
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
  usersRouter.get('/', validateAccessToken, isAdmin, userController.getAll)

  /**
   * @swagger
   *  /api/v1/users:
   *    post:
   *      summary: Register
   *      tags: [User]
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                name:
   *                  type: string
   *                email:
   *                  type: string
   *                  format: email
   *                password:
   *                  type: string
   *                  format: password
   *                passwordConfirm:
   *                  type: string
   *                  format: password
   *                phoneNum:
   *                  type: string
   *              required:
   *                - name
   *                - email
   *                - password
   *                - passwordConfirm
   *                - phoneNum
   *              example:
   *                name: "New Username"
   *                email: "example@example.com"
   *                password: "password123"
   *                passwordConfirm: "password123"
   *                phoneNum: "2389092370"
   *      responses:
   *        201:
   *          description: Successfull Registration
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: integer
   *                    example: 201
   *                  statusMessage:
   *                    type: string
   *                    example: "Successfull Registration"
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
   *                          example: "password"
   *                        message:
   *                          type: string
   *                          example: "Passwords do not match"
   *        409:
   *          description: Username or Email already exists
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: integer
   *                    example: 409
   *                  statusMessage:
   *                    type: string
   *                    example: "Already Exists"
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
  usersRouter.post('/', userController.create)

  /**
   * @swagger
   *  /api/v1/users:
   *    patch:
   *      summary: Update profile information
   *      tags: [User]
   *      security:
   *        - cookieAuth: []
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                name:
   *                  type: string
   *                phoneNum:
   *                  type: string
   *              example:
   *                name: "Updated username"
   *                phoneNum: "5647901287"
   *      responses:
   *        200:
   *          description: Profile information successfully updated
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
   *                      id:
   *                        type: string
   *                        format: uuid
   *                      name:
   *                        type: string
   *                      email:
   *                        type: string
   *                        format: email
   *                      phoneNumber:
   *                        type: string
   *                      role:
   *                        type: string
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
   *                          example: "name"
   *                        message:
   *                          type: string
   *                          example: "name must be a string"
   *        400:
   *          description: Missing parameters
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
   *                    example: "Missing Parameters"
   *                  error:
   *                    type: string
   *                    example: "Missing required parameters"
   *        404:
   *          description: User not found
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
   *                    example: "We did not find a user with that data"
   *        409:
   *          description: Username already exists
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: integer
   *                    example: 409
   *                  statusMessage:
   *                    type: string
   *                    example: "Already Exists"
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
  usersRouter.patch('/', validateAccessToken, userController.update)

  /**
   * @swagger
   *  /api/v1/users/info:
   *    get:
   *      summary: Get profile info
   *      tags: [User]
   *      security:
   *        - cookieAuth: []
   *      responses:
   *        200:
   *          description: Successfully retrieved user profile information
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
   *                      id_user:
   *                        type: string
   *                        format: uuid
   *                      name:
   *                        type: string
   *                      email:
   *                        type: string
   *                        format: email
   *                      phone_number:
   *                        type: string
   *                      role:
   *                        type: string
   *        400:
   *          description: Missing parameters
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
   *                    example: "Missing Parameters"
   *                  error:
   *                    type: string
   *                    example: "Missing required parameters"
   *        404:
   *          description: User not found
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
   *                    example: "We did not find a user with that data"
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
  usersRouter.get('/info', validateAccessToken, userController.getById)

  usersRouter.patch('/password', validateAccessToken, userController.editPassword)

  usersRouter.patch('/role', validateAccessToken, isAdmin, userController.changeRole)

  usersRouter.post('/auth', userController.login)

  usersRouter.post('/logout', userController.logout)

  return usersRouter
}
