import { ROLES } from '../constants/roles.js'
import { validate } from 'uuid'
import { TURN_TYPES } from '../constants/registeredTurnsType.js'
import dayjs from 'dayjs'

export const isValidRole = (role) => {
  return Object.values(ROLES).includes(role)
}

export const isValidUuid = (id) => {
  return validate(id, 4) // 4 because uuidv4
}

export const isValidTurnsType = (type) => {
  return Object.values(TURN_TYPES).includes(type)
}

export const isCancellationAllowed = (turn) => {
  const turnDate = dayjs(turn.date_time).utc()
  const currentDate = dayjs().utc()
  const diffHours = turnDate.diff(currentDate, 'hour')

  if (diffHours < 24) return false
  return true
}
