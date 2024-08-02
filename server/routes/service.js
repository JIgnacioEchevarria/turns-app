import { Router } from 'express'
import { ServiceController } from '../controllers/service.js'
import { isAdmin, validateAccessToken } from '../utils/authorization.js'

export const createServiceRouter = ({ serviceModel }) => {
  const serviceRouter = Router()
  const serviceController = new ServiceController({ serviceModel })

  serviceRouter.get('/', serviceController.getAll)
  serviceRouter.post('/', validateAccessToken, isAdmin, serviceController.create)
  serviceRouter.patch('/:id/deactivate', validateAccessToken, isAdmin, serviceController.delete)
  serviceRouter.patch('/:id', validateAccessToken, isAdmin, serviceController.update)

  return serviceRouter
}
