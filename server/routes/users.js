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
   *          minLength: 8
   *        phone_number:
   *          type: string
   *          minLength: 9
   *          maxLength: 11
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
   *        name: "steveJobs33"
   *        email: "steve33@example.com"
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
   *                  minLength: 8
   *                passwordConfirm:
   *                  type: string
   *                  format: password
   *                  minLength: 8
   *                phoneNum:
   *                  type: string
   *                  minLength: 9
   *                  maxLength: 11
   *              required:
   *                - name
   *                - email
   *                - password
   *                - passwordConfirm
   *                - phoneNum
   *              example:
   *                name: "jhonDutch"
   *                email: "jdutchrd2@example.com"
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
   *                  error:
   *                    type: string
   *                    example: "There is already a user with that username"
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
   *                  minLength: 9
   *                  maxLength: 11
   *              example:
   *                name: "jDutch"
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
   *                        example: "jDutch"
   *                      email:
   *                        type: string
   *                        format: email
   *                        example: "jdutchrd2@example.com"
   *                      phoneNumber:
   *                        type: string
   *                        example: "5647901287"
   *                      role:
   *                        type: string
   *                        example: "client"
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
   *                  error:
   *                    type: string
   *                    example: "There is already a user with that username"
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
   *                        example: "jDutch"
   *                      email:
   *                        type: string
   *                        format: email
   *                        example: "jdutchrd2@example.com"
   *                      phone_number:
   *                        type: string
   *                        example: "5647901287"
   *                      role:
   *                        type: string
   *                        example: "client"
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

  /**
   * @swagger
   *  /api/v1/users/password:
   *    patch:
   *      summary: Edit password
   *      tags: [User]
   *      security:
   *        - cookieAuth: []
   *      requestBody:
   *        required: true
   *        content:
   *          appliction/json:
   *            schema:
   *              type: object
   *              properties:
   *                currentPassword:
   *                  type: string
   *                  minLength: 8
   *                newPassword:
   *                  type: string
   *                  minLength: 8
   *                passwordConfirm:
   *                  type: string
   *                  minLength: 8
   *              required:
   *                - currentPassword
   *                - newPassword
   *                - passwordConfirm
   *              example:
   *                currentPassword: "password123"
   *                newPassword: "12345pass"
   *                passwordConfirm: "12345pass"
   *      responses:
   *        200:
   *          description: Password updated successfully
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
   *                    example: "User not found"
   *        401:
   *          description: Incorrect password
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
   *                    example: "Invalid Credentials"
   *                  error:
   *                    type: string
   *                    example: "Incorrect password"
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
  usersRouter.patch('/password', validateAccessToken, userController.editPassword)

  /**
   * @swagger
   *  /api/v1/users/role:
   *    patch:
   *      summary: Change role to a user
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
   *                id:
   *                  type: string
   *                  format: uuid
   *                role:
   *                  type: string
   *                  enum:
   *                    - client
   *                    - admin
   *              required:
   *                - id
   *                - role
   *              example:
   *                id: "ed205999-b6ea-417b-8bfc-a3eb9a603b1a"
   *                role: "admin"
   *      responses:
   *        200:
   *          description: Role updated successfully
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
   *          description: Bad request
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
   *                    example: "Invalid role provided"
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
   *                    example: "User not found"
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
  usersRouter.patch('/role', validateAccessToken, isAdmin, userController.changeRole)

  /**
   * @swagger
   *  /api/v1/users/auth:
   *    post:
   *      summary: Login
   *      tags: [User]
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                email:
   *                  type: string
   *                  format: email
   *                password:
   *                  type: string
   *                  format: password
   *              required:
   *                - email
   *                - password
   *              example:
   *                email: "jdutchrd2@example.com"
   *                password: "password123"
   *      responses:
   *        200:
   *          description: Successfull login
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
   *                        example: "ed205999-b6ea-417b-8bfc-a3eb9a603b1a"
   *                      name:
   *                        type: string
   *                        example: "jDutch"
   *                      email:
   *                        type: string
   *                        format: email
   *                        example: "jdutchrd2@example.com"
   *                      phoneNumber:
   *                        type: string
   *                        example: "2389092370"
   *                      role:
   *                        type: string
   *                        example: "client"
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
   *        401:
   *          description: Incorrect password
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
   *                    example: "Invalid Credentials"
   *                  error:
   *                    type: string
   *                    example: "Incorrect password"
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
  usersRouter.post('/auth', userController.login)

  /**
   * @swagger
   *  /api/v1/users/logout:
   *    post:
   *      summary: Logout
   *      tags: [User]
   *      security:
   *        - cookieAuth: []
   *      responses:
   *        200:
   *          description: Successfull logout
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  status:
   *                    type: integer
   *                    example: 200
   *                  statusMessage:
   *                    type: integer
   *                    example: "Success"
  */
  usersRouter.post('/logout', userController.logout)

  return usersRouter
}
