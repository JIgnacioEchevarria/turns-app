import { AlreadyExistsError, ConnectionError, InvalidCredentialsError, NotFoundError } from '../errors.js'
import { validatePartialUser, validatePassword, validateUser } from '../schemes/schemes.js'
import { isValidRole, isValidUuid } from '../utils/validation.js'
import { transporter } from '../utils/mailer.js'

export class UserController {
  constructor ({ userModel }) {
    this.userModel = userModel
  }

  // Obtener todos los usuarios
  getAll = async (req, res) => {
    try {
      const users = await this.userModel.getAll()

      return res.status(200).json({ status: 200, statusMessage: 'Success', data: users })
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ status: 404, statusMessage: 'Not Found', error: error.message })
      }

      if (error instanceof ConnectionError) {
        return res.status(500).json({ status: 500, statusMessage: 'Failed Connection', error: error.message })
      }
    }
  }

  // Obtener un usuario por id
  getById = async (req, res) => {
    try {
      const id = req.user.id

      if (!isValidUuid(id)) return res.status(400).json({ status: 400, statusMessage: 'Bad Request', error: 'Invalid user ID provided' })

      const user = await this.userModel.getById({ id })
      return res.status(200).json({ status: 200, statusMessage: 'Success', data: user })
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ status: 404, statusMessage: 'Not Found', error: error.message })
      }

      if (error instanceof ConnectionError) {
        return res.status(500).json({ status: 500, statusMessage: 'Failed Connection', error: error.message })
      }
    }
  }

  // Registro de usuario
  create = async (req, res) => {
    try {
      const result = validateUser(req.body)

      if (!result.success) {
        return res.status(422).json({
          status: 422,
          statusMessage: 'Validation Error',
          error: result.error.errors.map(e => ({
            field: e.path[0],
            message: e.message
          }))
        })
      }

      const { name, email, password, passwordConfirm, phoneNum } = result.data

      if (password !== passwordConfirm) {
        return res.status(422).json({ status: 422, statusMessage: 'Validation Error', error: [{ field: 'password', message: 'Passwords do not match' }] })
      }

      await this.userModel.create({ info: { name, email, password, phoneNum } })

      await transporter.sendMail({
        from: `"JIE Turnos" <${process.env.OUT_EMAIL}>`,
        to: email,
        subject: 'Gracias por crear una cuenta en JIE Turnos',
        text: 'Este correo es para confirmar la creación de tu cuenta en JIE Turnos, ya puedes iniciar sesión y programar citas cuando quieras.'
      }).catch(() => {})

      return res.status(201).json({ status: 201, statusMessage: 'Successful Registration' })
    } catch (error) {
      if (error instanceof AlreadyExistsError) {
        return res.status(409).json({ status: 409, statusMessage: 'Already Exists', error: error.message })
      }

      if (error instanceof ConnectionError) {
        return res.status(500).json({ status: 500, statusMessage: 'Failed Connection', error: error.message })
      }
    }
  }

  // Inicio de sesión
  login = async (req, res) => {
    try {
      const result = validatePartialUser(req.body)

      if (!result.success) {
        return res.status(422).json({
          status: 422,
          statusMessage: 'Validation Error',
          error: result.error.errors.map(e => ({
            field: e.path[0],
            message: e.message
          }))
        })
      }

      const { email, password } = result.data

      const { token, userLogged } = await this.userModel.login({ email, password })
      res.cookie('access_token', token, {
        httpOnly: true, // La cookie solo se puede acceder en el servidor
        secure: true, // La cookie solo se puede acceder en https
        sameSite: 'none',
        domain: process.env.COOKIE_DOMAIN,
        path: '/'
      })
      return res.status(200).json({ status: 200, statusMessage: 'Successful Authentication', data: userLogged })
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return res.status(401).json({ status: 401, statusMessage: 'Invalid Credentials', error: error.message })
      }

      if (error instanceof ConnectionError) {
        return res.status(500).json({ status: 500, statusMessage: 'Failed Connection', error: error.message })
      }
    }
  }

  // Cerrar sesión
  logout = (req, res) => {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: process.env.COOKIE_DOMAIN,
      path: '/'
    })
    return res.status(200).json({ status: 200, statusMessage: 'Success' })
  }

  // Edición del perfil
  update = async (req, res) => {
    try {
      const result = validatePartialUser(req.body)

      if (!result.success) {
        return res.status(422).json({
          status: 422,
          statusMessage: 'Validation Error',
          error: result.error.errors.map(e => ({
            field: e.path[0],
            message: e.message
          }))
        })
      }

      const id = req.user.id

      if (!isValidUuid(id)) return res.status(400).json({ status: 400, statusMessage: 'Bad Request', error: 'Invalid user ID provided' })

      const updatedUser = await this.userModel.update({ id, info: result.data })

      return res.status(200).json({ status: 200, statusMessage: 'Success', data: updatedUser })
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ status: 404, statusMessage: 'Not Found', error: error.message })
      }

      if (error instanceof AlreadyExistsError) {
        return res.status(409).json({ status: 409, statusMessage: 'Already Exists', error: error.message })
      }

      if (error instanceof ConnectionError) {
        return res.status(500).json({ status: 500, statusMessage: 'Failed Connection', error: error.message })
      }
    }
  }

  // Editar contraseña.
  editPassword = async (req, res) => {
    try {
      const result = validatePassword(req.body)

      if (!result.success) {
        return res.status(422).json({
          status: 422,
          statusMessage: 'Validation Error',
          error: result.error.errors.map(e => ({
            field: e.path[0],
            message: e.message
          }))
        })
      }

      const id = req.user.id

      if (!isValidUuid(id)) return res.status(400).json({ status: 400, statusMessage: 'Bad Request', error: 'Invalid user ID provided' })

      const { currentPassword, newPassword, passwordConfirm } = result.data

      if (newPassword.length < 8) {
        return res.status(422).json({ status: 422, statusMessage: 'Validation Error', error: [{ field: 'password', message: 'Password must be at least 8 characters' }] })
      }

      if (newPassword !== passwordConfirm) {
        return res.status(422).json({ status: 422, statusMessage: 'Validation Error', error: [{ field: 'password', message: 'Passwords do not match' }] })
      }

      await this.userModel.editPassword({ id, info: { currentPassword, newPassword } })

      return res.status(200).json({ status: 200, statusMessage: 'Success' })
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ status: 404, statusMessage: 'Not Found', error: error.message })
      }

      if (error instanceof InvalidCredentialsError) {
        return res.status(401).json({ status: 401, statusMessage: 'Invalid Credentials', error: error.message })
      }

      if (error instanceof ConnectionError) {
        return res.status(500).json({ status: 500, statusMessage: 'Failed Connection', error: error.message })
      }
    }
  }

  changeRole = async (req, res) => {
    try {
      const info = req.body
      const userId = req.user.id

      if (!isValidUuid(userId) || !isValidUuid(info.id)) return res.status(400).json({ status: 400, statusMessage: 'Bad Request', error: 'Invalid user ID provided' })

      if (userId === info.id) return res.status(403).json({ status: 403, statusMessage: 'Access Not Authorized' })

      if (!isValidRole(info.role)) return res.status(400).json({ status: 400, statusMessage: 'Bad Request', error: 'Invalid role provided' })

      await this.userModel.changeRole({ id: info.id, role: info.role })

      return res.status(200).json({ status: 200, statusMessage: 'Success' })
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ status: 404, statusMessage: 'Not Found', error: error.message })
      }

      if (error instanceof ConnectionError) {
        return res.status(500).json({ status: 500, statusMessage: 'Failed Connection', error: error.message })
      }
    }
  }
}
