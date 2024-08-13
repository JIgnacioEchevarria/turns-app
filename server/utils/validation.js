import { ROLES } from '../constants/roles.js'
import { validate } from 'uuid'
import { TURN_TYPES } from '../constants/registeredTurnsType.js'

export const isValidRole = (role) => {
  return Object.values(ROLES).includes(role)
}

export const isValidUuid = (id) => {
  return validate(id, 4) // 4 because uuidv4
}

export const isValidTurnsType = (type) => {
  return Object.values(TURN_TYPES).includes(type)
}
