import { Router } from 'express'
import { ServiceController } from '../controllers/service.js'
import { isAdmin, isAdminOrEmployee, validateAccessToken } from '../utils/authorization.js'

export const createServiceRouter = ({ serviceModel }) => {
  const serviceRouter = Router()
  const serviceController = new ServiceController({ serviceModel })

  /**
   * @swagger
   * components:
   *  securitySchemes:
   *    cookieAuth:
   *      type: apiKey
   *      in: cookie
   *      name: access_token
   *  schemas:
   *    Service:
   *      type: object
   *      properties:
   *        id:
   *          type: string
   *          format: uuid
   *        name:
   *          type: string
   *        duration:
   *          type: integer
   *          minimum: 1
   *          decription: duration of service in minutes
   *        price:
   *          type: integer
   *          minimum: 1
   *        is_active:
   *          type: boolean
   *          default: true
   *      required:
   *        - name
   *        - duration
   *        - price
   *      example:
   *        id: "545d029b-0b2c-4099-9b91-c3a9dc6b1231"
   *        name: "Corte y barba"
   *        duration: 30
   *        price: 6500
   *        is_active: true
  */

  /**
   * @swagger
   *  /api/v1/services:
   *    get:
   *      summary: Get all services
   *      tags: [Service]
   *      responses:
   *        200:
   *          description: A list of all services
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
   *                      $ref: '#/components/schemas/Service'
   *        404:
   *          description: No services available
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
   *                    example: "No services available"
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
  serviceRouter.get('/', serviceController.getAll)

  /**
   * @swagger
   *  /api/v1/services:
   *    post:
   *      summary: Create a new service
   *      tags: [Service]
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
   *                duration:
   *                  type: integer
   *                  minimum: 1
   *                price:
   *                  type: integer
   *                  minimum: 1
   *              required:
   *                - name
   *                - duration
   *                - price
   *              example:
   *                name: "Haircut"
   *                duration: 45
   *                price: 100
   *      responses:
   *        201:
   *          description: Service created successfully
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
   *                    example: "Success"
   *                  data:
   *                    type: object
   *                    $ref: '#/components/schemas/Service'
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
   *        409:
   *          description: The service already exists
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
   *                    example: "The service already exists"
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
  serviceRouter.post('/', validateAccessToken, isAdminOrEmployee, serviceController.create)

  /**
   * @swagger
   *  /api/v1/services/{id}/deactivate:
   *    patch:
   *      summary: Delete service
   *      tags: [Service]
   *      security:
   *        - cookieAuth: []
   *      parameters:
   *        - in: path
   *          name: id
   *          required: true
   *          schema:
   *            type: string
   *            format: uuid
   *          description: The ID of the service to delete
   *      responses:
   *        200:
   *          description: Service successfully removed
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
   *                    example: "Invalid service ID provided"
   *        404:
   *          description: Service not found
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
   *                    example: "Service not found"
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
  serviceRouter.patch('/:id/deactivate', validateAccessToken, isAdminOrEmployee, serviceController.delete)

  /**
   * @swagger
   *  /api/v1/services/{id}:
   *    patch:
   *      summary: Edit service
   *      tags: [Service]
   *      security:
   *        - cookieAuth: []
   *      parameters:
   *        - in: path
   *          name: id
   *          required: true
   *          schema:
   *            type: string
   *            format: uuid
   *          description: The ID of the service to edit
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                name:
   *                  type: string
   *                duration:
   *                  type: integer
   *                  minimum: 1
   *                price:
   *                  type: integer
   *                  minimum: 1
   *              example:
   *                name: "Hair and beard cut"
   *                duration: 60
   *                price: 100
   *      responses:
   *        200:
   *          description: Service updated successfully
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
   *                    $ref: '#/components/schemas/Service'
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
   *        404:
   *          description: Service not found
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
   *                    example: "Service not found"
   *        409:
   *          description: The service already exists
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
   *                    example: "The service already exists"
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
  serviceRouter.patch('/:id', validateAccessToken, isAdminOrEmployee, serviceController.update)

  return serviceRouter
}
