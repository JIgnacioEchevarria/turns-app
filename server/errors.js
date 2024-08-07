export class ConnectionError extends Error {
  constructor (message) {
    super(message)
    this.name = 'ConnectionError'
    this.stack = ''
  }
}

export class InvalidCredentialsError extends Error {
  constructor (message) {
    super(message)
    this.name = 'InvalidCredentialsError'
    this.stack = ''
  }
}

export class NotAvailableError extends Error {
  constructor (message) {
    super(message)
    this.name = 'NotAvailableError'
    this.stack = ''
  }
}

export class AlreadyExistsError extends Error {
  constructor (message) {
    super(message)
    this.name = 'AlreadyExistsError'
    this.stack = ''
  }
}

export class NotFoundError extends Error {
  constructor (message) {
    super(message)
    this.name = 'NotFoundError'
    this.stack = ''
  }
}

export class ForBiddenError extends Error {
  constructor (message) {
    super(message)
    this.name = 'ForBiddenError'
    this.stack = ''
  }
}

export class CorsError extends Error {
  constructor (message) {
    super(message)
    this.name = 'CorsError'
    this.stack = ''
  }
}

export class UnauthorizedError extends Error {
  constructor (message) {
    super(message)
    this.name = 'UnauthorizedError'
    this.stack = ''
  }
}
