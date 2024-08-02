export const userErrorMessages = (message) => {
  if (message === 'Invalid password or email') return 'Email o contraseña invalidos'
  if (message === 'ID and ROLE attributes are required') return 'Los atributos ID y ROLE son obligatorios'
  if (message === 'Invalid role provided') return 'El rol proporcionado es inválido'
}

export const userFormErrorMessages = (message) => {
  if (message === 'Password must be at least 8 characters') return 'La contraseña debe tener al menos 8 caracteres'
  if (message === 'Phone number must be at least 9 characters') return 'El télefono debe tener al menos 9 caracteres'
  if (message === 'Phone number must be at most 11 characters') return 'El télefono debe tener 11 caracteres como máximo'
  if (message === 'Passwords do not match') return 'Las contraseñas no coinciden'
  if (message === 'There is already a user with that username') return 'El nombre de usuario ya existe'
  if (message === 'Incorrect password') return 'La contraseña es incorrecta'
  if (message === 'Number must be greater than 0') return 'Debes ingresar un número mayor que cero'
  if (message === 'Invalid email') return 'Email inválido'
  return message
}

export const turnErrorMessages = (message) => {
  if (message === 'There are no turns available for the selected day') return 'No hay turnos disponibles para el día seleccionado'
  if (message === 'Turn not available') return 'El turno no esta disponible'
  if (message === 'You cannot cancel the turn because the time limit has been exceeded') return 'No puedes cancelar el turno, debes hacerlo 24 horas antes del mismo'
  if (message === 'Invalid calendar settings') return 'La configuración del calendario es inválida, por favor verifica tus ajustes y vuelve a intentarlo'
  return 'Ha ocurrido un error inesperado, intente de nuevo más tarde'
}

export const serviceErrorMessages = (message) => {
  if (message === 'The service already exists') return 'Ya existe un servicio con ese nombre'
  return 'Ha ocurrido un error inesperado, intente de nuevo más tarde'
}
