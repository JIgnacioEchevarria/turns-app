import { ROLES } from '../constants/roles.js'
import { validate } from 'uuid'

export const isValidRole = (role) => {
  return Object.values(ROLES).includes(role)
}

export const isValidUuid = (id) => {
  return validate(id, 4) // 4 because uuidv4
}
