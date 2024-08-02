export const roleToText = (role) => {
  if (role === 'admin') return 'Administrador'
  if (role === 'client') return 'Cliente'
  return role
}
