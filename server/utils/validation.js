import { Roles } from '../constants/roles.js'

export const isValidRole = (role) => {
  return Object.values(Roles).includes(role)
}
