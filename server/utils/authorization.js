import jwt from 'jsonwebtoken'
import { ROLES } from '../constants/roles.js'

export const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: '1h' }) // Info - palabra secreta - expiración
}

export const validateAccessToken = (req, res, next) => {
  const token = req.cookies.access_token

  if (!token) return res.status(403).json({ status: 403, statusMessage: 'Access Not Authorized' })

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ status: 403, statusMessage: 'Access Not Authorized' })
    } else {
      req.user = user
      next()
    }
  })
}

const hasRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ status: 403, statusMessage: 'Access Not Authorized' })
    }
    next()
  }
}

export const isAdmin = hasRole([ROLES.ADMIN])
export const isAdminOrEmployee = hasRole([ROLES.ADMIN, ROLES.EMPLOYEE])
