import jwt from 'jsonwebtoken'

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

export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ status: 403, statusMessage: 'Access Not Authorized' })
  }

  next()
}
