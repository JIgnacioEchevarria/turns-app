import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestión de Turnos',
      version: '1.0.0',
      description: 'Documentación de la API REST para la Gestión de turnos'
    }
  },
  apis: ['./routes/*.js']
}

const swaggerSpec = swaggerJSDoc(options)

export const setupSwagger = (app) => {
  app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
