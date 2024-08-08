export const syntaxMiddleware = () => (error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ status: 400, statusMessage: 'Syntax Error', error: 'Invalid object JSON provided' })
  }
  next()
}
