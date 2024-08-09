import { ROLES } from '../constants/roles.js'

export const roleToText = (role) => {
  if (role === ROLES.ADMIN) return 'Administrador'
  if (role === ROLES.EMPLOYEE) return 'Empleado'
  if (role === ROLES.CLIENT) return 'Cliente'
  return role
}
