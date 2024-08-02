import dayjs from 'dayjs'
import { ConnectionError, ForBiddenError, NotAvailableError, NotFoundError } from '../errors.js'
import { validateCalendar } from '../schemes/schemes.js'

export class TurnController {
  constructor ({ turnModel }) {
    this.turnModel = turnModel
  }

  getAll = async (req, res) => {
    try {
      const date = req.params.date

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
          if (!validSlots) return res.status(422).json({ status: 422, statusMessage: 'Validation Error', error: 'Invalid calendar settings' })
          // Por cada franja horaria se verifica que el comienxo no sea mayor que el final.
          for (const slot of day.timeSlots) {
            const start = dayjs(`${today}T${slot.start}`)
            const end = dayjs(`${today}T${slot.end}`)

            if (start.isAfter(end) || start.isSame(end)) return res.status(422).json({ status: 422, statusMessage: 'Validation Error', error: 'Invalid calendar settings' })
          }
          // Si se tiene dos franjas horarias en un dia, se verifica que el final de la primer franja
          // no sea mayor que el comienzo de la segunda
          if (day.timeSlots.length === 2) {
            const endFirstTimeSlot = dayjs(`${today}T${day.timeSlots[0].end}`)
            const startSecondTimeSlot = dayjs(`${today}T${day.timeSlots[1].start}`)
            if (endFirstTimeSlot.isAfter(startSecondTimeSlot) || endFirstTimeSlot.isSame(startSecondTimeSlot)) return res.status(422).json({ status: 422, statusMessage: 'Validation Error', error: 'Invalid calendar settings' })
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

      if (!turnId || !userId || !serviceId) {
        return res.status(400).json({ status: 400, statusMessage: 'Missing Parameters', error: 'Missing required parameters' })
      }

      const turn = await this.turnModel.request({ turnId, userId, serviceId })

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

      if (!userId) {
        return res.status(400).json({ status: 400, statusMessage: 'Missing Parameters', error: 'Missing required parameters' })
      }

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

      await this.turnModel.cancel({ turnId, userId })

      return res.status(200).json({ status: 200, statusMessage: 'Success' })
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ status: 404, statusMessage: 'Not Found', error: error.message })
      }

      if (error instanceof ForBiddenError) {
        return res.status(403).json({ status: 403, statusMessage: 'For Bidden Error', error: error.message })
      }

      if (error instanceof ConnectionError) {
        return res.status(500).json({ status: 500, statusMessage: 'Failed Connection', error: error.message })
      }
    }
  }
}
