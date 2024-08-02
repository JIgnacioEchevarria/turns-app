import { Router } from 'express'
import { UserController } from '../controllers/user.js'
import { isAdmin, validateAccessToken } from '../utils/authorization.js'

export const createUserRouter = ({ userModel }) => {
  const usersRouter = Router()

  const userController = new UserController({ userModel })

  usersRouter.get('/', validateAccessToken, isAdmin, userController.getAll)
  usersRouter.post('/', userController.create)
  usersRouter.patch('/', validateAccessToken, userController.update)

  usersRouter.get('/info', validateAccessToken, userController.getById)
  usersRouter.patch('/password', validateAccessToken, userController.editPassword)
  usersRouter.patch('/role', validateAccessToken, isAdmin, userController.changeRole)
  usersRouter.post('/auth', userController.login)
  usersRouter.post('/logout', userController.logout)

  return usersRouter
}
