import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import { ConnectionError, UnauthorizedError, NotAvailableError, NotFoundError } from '../errors.js'
import { validateCalendar } from '../schemes/schemes.js'
import { isValidUuid } from '../utils/validation.js'
import { transporter } from '../utils/mailer.js'

dayjs.extend(customParseFormat)

export class TurnController {
  constructor ({ turnModel }) {
    this.turnModel = turnModel
  }

  getAll = async (req, res) => {
    try {
      const date = req.params.date

      const format = 'YYYY-MM-DD'

      if (!dayjs(date, format, true).isValid()) return res.status(400).json({ status: 400, statusMessage: 'Bad Request', error: 'Invalid date format' })

      const turns = await this.turnModel.getAll({ date })

      return res.status(200).json({ status: 200, statusMessage: 'Success', data: turns })
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ status: 404, statusMessage: 'Not Found', error: error.message })
      }

      if (error instanceof ConnectionError) {
        return res.status(500).json({ status: 500, statusMessage: 'Failed Connection', error: error.message })
      }
    }
  }

  getTurnsByDate = async (req, res) => {
    try {
      const date = req.params.date

      const format = 'YYYY-MM-DD'

      if (!dayjs(date, format, true).isValid()) return res.status(400).json({ status: 400, statusMessage: 'Bad Request', error: 'Invalid date format' })

      const turns = await this.turnModel.getTurnsByDate({ date })

      return res.status(200).json({ status: 200, statusMessage: 'Success', data: turns })
    } catch (error) {
      if (error instanceof NotAvailableError) {
        return res.status(404).json({ status: 404, statusMessage: 'Not Available', error: error.message })
      }

      if (error instanceof ConnectionError) {
        return res.status(500).json({ status: 500, statusMessage: 'Failed Connection', error: error.message })
      }
    }
  }

  configureCalendar = async (req, res) => {
    try {
      const calendarSettings = req.body
      const { attentionSchedule, interval, deadline } = calendarSettings

      const format = 'YYYY-MM-DD'

      if (!dayjs(deadline, format, true).isValid()) return res.status(400).json({ status: 400, statusMessage: 'Bad Request', error: 'Invalid date format' })

      // Valido intervalos de timpo entre turnos y fecha límite de la configuración
      const result = validateCalendar({ interval, deadline })
      if (!result.success) {
        return res.status(422).json({
          status: 422,
          statusMessage: 'Validation Error',
          error: result.error.errors.map(e => ({
            field: e.path[0],
            message: e.message
          }))
        })
      }

      // Fecha actual para poder convertir los horarios en un objeto dayjs
      const today = dayjs().format('YYYY-MM-DD')
      // Valido los horarios de atención
      for (const day of attentionSchedule) {
        if (day.checked) {
          const validSlots = day.timeSlots.every(slot => slot.start !== null && slot.end !== null)
          if (!validSlots) return res.status(422).json({ status: 422, statusMessage: 'Validation Error', error: [{ field: 'timeSlots', message: 'Invalid time slots' }] })
          // Por cada franja horaria se verifica que el comienxo no sea mayor que el final.
          for (const slot of day.timeSlots) {
            const start = dayjs(`${today}T${slot.start}`)
            const end = dayjs(`${today}T${slot.end}`)

            if (start.isAfter(end) || start.isSame(end)) return res.status(422).json({ status: 422, statusMessage: 'Validation Error', error: [{ field: 'timeSlots', message: 'Invalid time slots' }] })
          }
          // Si se tiene dos franjas horarias en un dia, se verifica que el final de la primer franja
          // no sea mayor que el comienzo de la segunda
          if (day.timeSlots.length === 2) {
            const endFirstTimeSlot = dayjs(`${today}T${day.timeSlots[0].end}`)
            const startSecondTimeSlot = dayjs(`${today}T${day.timeSlots[1].start}`)
            if (endFirstTimeSlot.isAfter(startSecondTimeSlot) || endFirstTimeSlot.isSame(startSecondTimeSlot)) return res.status(422).json({ status: 422, statusMessage: 'Validation Error', error: [{ field: 'timeSlots', message: 'Invalid time slots' }] })
          }
        }
      }

      const currentTurns = await this.turnModel.getCurrentTurns()

      // Genero los nuevos turnos
      const newTurns = await this.turnModel.generate({ attentionSchedule, interval, deadline })

      // Filtro y elimino los turnos actuales que no coinciden con los nuevos horarios
      const turnsToAdd = await this.turnModel.filterAndDeleteTurns({ currentTurns, newTurns })

      await this.turnModel.insertAll({ turns: turnsToAdd })

      return res.status(200).json({ status: 200, statusMessage: 'Success' })
    } catch (error) {
      if (error instanceof ConnectionError) {
        return res.status(500).json({ status: 500, statusMessage: 'Failed Connection', error: error.message })
      }
    }
  }

  request = async (req, res) => {
    try {
      const { turnId, serviceId } = req.query
      const userId = req.user.id

      // UUID verification
      if (!isValidUuid(turnId)) return res.status(400).json({ status: 400, statusMessage: 'Bad Request', error: 'Invalid turn ID provided' })
      if (!isValidUuid(serviceId)) return res.status(400).json({ status: 400, statusMessage: 'Bad Request', error: 'Invalid service ID provided' })
      if (!isValidUuid(userId)) return res.status(400).json({ status: 400, statusMessage: 'Bad Request', error: 'Invalid user ID provided' })

      const turn = await this.turnModel.request({ turnId, userId, serviceId })

      const turnInfoClient = `
        Usuario: ${turn.name}
        Servicio: ${turn.service}
        Duración: ${turn.duration}
        Valor: $${turn.price}
        Fecha: ${turn.date}
        Hora: ${turn.time}
      `

      const turnInfoAdmin = `
        Usuario: ${turn.name}
        Email: ${turn.email}
        Teléfono: ${turn.phoneNumber}
        Servicio: ${turn.service}
        Fecha: ${turn.date}
        Hora: ${turn.time}
      `

      await transporter.sendMail({
        from: process.env.OUT_EMAIL,
        to: process.env.OUT_EMAIL,
        subject: `${turn.name} ha solicitado un turno`,
        text: `Se ha solicitado un turno con la siguiente información:\n\n${turnInfoAdmin}`
      }).catch(() => {})

      await transporter.sendMail({
        from: process.env.OUT_EMAIL,
        to: turn.email,
        subject: 'Gracias por solicitar un turno en JIE',
        text: `La información de tu turno es la siguiente:\n\n${turnInfoClient}`
      }).catch(() => {})

      return res.status(200).json({ status: 200, statusMessage: 'Success', data: turn })
    } catch (error) {
      if (error instanceof NotAvailableError) {
        return res.status(404).json({ status: 404, statusMessage: 'Not Available', error: error.message })
      }

      if (error instanceof ConnectionError) {
        return res.status(500).json({ status: 500, statusMessage: 'Failed Connection', error: error.message })
      }
    }
  }

  getUserTurns = async (req, res) => {
    try {
      const userId = req.user.id

      if (!isValidUuid(userId)) return res.status(400).json({ status: 400, statusMessage: 'Bad Request', error: 'Invalid user ID provided' })

      const turns = await this.turnModel.getUserTurns({ userId })

      return res.status(200).json({ status: 200, statusMessage: 'Success', data: turns })
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ status: 404, statusMessage: 'Not Found', error: error.message })
      }

      if (error instanceof ConnectionError) {
        return res.status(500).json({ status: 500, statusMessage: 'Failed Connection', error: error.message })
      }
    }
  }

  cancel = async (req, res) => {
    try {
      const turnId = req.params.id
      const userId = req.user.id

      // UUID verification
      if (!isValidUuid(userId)) return res.status(400).json({ status: 400, statusMessage: 'Bad Request', error: 'Invalid user ID provided' })
      if (!isValidUuid(turnId)) return res.status(400).json({ status: 400, statusMessage: 'Bad Request', error: 'Invalid turn ID provided' })

      await this.turnModel.cancel({ turnId, userId })

      // Antes de la respuesta mandar mail de confirmación de cancelacion de turno tanto al cliente como al administrador.
      return res.status(200).json({ status: 200, statusMessage: 'Success' })
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ status: 404, statusMessage: 'Not Found', error: error.message })
      }

      if (error instanceof UnauthorizedError) {
        return res.status(401).json({ status: 401, statusMessage: 'Unauthorized', error: error.message })
      }

      if (error instanceof ConnectionError) {
        return res.status(500).json({ status: 500, statusMessage: 'Failed Connection', error: error.message })
      }
    }
  }
}
