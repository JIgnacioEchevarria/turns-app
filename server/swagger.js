import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Gestión de Turnos',
      version: '1.0.0'
    }
  },
  apis: ['./routes/*.js']
}

const swaggerSpec = swaggerJSDoc(options)

export const setupSwagger = (app) => {
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  app.get('/api/v1/docs.json', (req, res) => {
    res.setHeader('Content-type', 'application/json')
    res.send(swaggerSpec)
  })
}
