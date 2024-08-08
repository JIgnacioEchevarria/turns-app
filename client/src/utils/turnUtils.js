export const turnDuration = (duration) => {
  const hours = Math.floor(duration / 60)
  const minutes = (duration % 60).toString().padStart(2, '0')

  // Si los minutos son cero se devuelve solo la parte de la hora.
  if (minutes === '00') return `${hours} hs`

  // Si la hora esta en cero se devuelve solo los minutos.
  if (hours === 0) return `${minutes} min`

  // Devuelve la hora con los minutos.
  return `${hours}:${minutes} hs`
}

export const translateDay = (day) => {
  if (day === 'Monday') return 'Lunes'
  if (day === 'Tuesday') return 'Martes'
  if (day === 'Wednesday') return 'Miercoles'
  if (day === 'Thursday') return 'Jueves'
  if (day === 'Friday') return 'Viernes'
  if (day === 'Saturday') return 'Sábado'
  if (day === 'Sunday') return 'Domingo'
  return day
}
