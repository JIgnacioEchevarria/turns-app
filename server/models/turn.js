import { pool } from '../database/connectionPostgreSQL.js'
import dayjs from 'dayjs'
import moment from 'moment-timezone'
import { ConnectionError, UnauthorizedError, NotAvailableError, NotFoundError } from '../errors.js'

export class TurnModel {
  static async getAll ({ date }) {
    try {
      const turns = await pool.query(
        `SELECT id_turn, t.date_time, user_id AS id_user, u.name username, u.email userEmail, u.phone_number, t.service_id AS id_service, s.name service, s.price, s.duration
          FROM turns t
          INNER JOIN users u ON t.user_id = u.id_user
          INNER JOIN services s ON t.service_id = s.id_service
          WHERE t.available = false
          AND DATE(t.date_time) = DATE($1);`,
        [date]
      )

      if (turns.rowCount === 0) throw new NotFoundError('Turns not found')

      const turnsWithLocalTime = turns.rows.map(turn => ({
        ...turn,
        date_time: moment(turn.date_time).tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DD HH:mm:ss'),
        date: moment(turn.date_time).tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DD'),
        time: moment(turn.date_time).tz('America/Argentina/Buenos_Aires').format('HH:mm')
      }))

      return turnsWithLocalTime
    } catch (error) {
      if (error instanceof NotFoundError) throw error

      throw new ConnectionError('Database is not available')
    }
  }

  static async getTurnsByDate ({ date }) {
    const currentDate = dayjs().format('YYYY-MM-DD')
    const timeLimit = dayjs().add(12, 'hour').second(0).millisecond(0).format('YYYY-MM-DD HH:mm:ss')

    try {
      const turns = await pool.query(
        `SELECT id_turn, date_time
          FROM turns
          WHERE available = true
          AND DATE(date_time) = DATE($1)
          AND DATE(date_time) > DATE($2)
          AND date_time >= $3
          ORDER BY date_time;`,
        [date, currentDate, timeLimit]
      )

      if (turns.rowCount === 0) throw new NotAvailableError('There are no turns available for the selected day')

      const turnsWithLocalTime = turns.rows.map(turn => ({
        ...turn,
        date_time: moment(turn.date_time).tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DD HH:mm:ss'),
        date: moment(turn.date_time).tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DD'),
        time: moment(turn.date_time).tz('America/Argentina/Buenos_Aires').format('HH:mm')
      }))

      return turnsWithLocalTime
    } catch (error) {
      if (error instanceof NotAvailableError) throw error

      throw new ConnectionError('Database is not available')
    }
  }

  static async getCurrentTurns () {
    try {
      const turns = await pool.query(
        `SELECT id_turn, date_time, available 
          FROM turns`
      )

      const turnsWithLocalTime = turns.rows.map(turn => ({
        ...turn,
        date_time: moment(turn.date_time).tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DD HH:mm:ss')
      }))

      return turnsWithLocalTime
    } catch (error) {
      throw new ConnectionError('Database is not available')
    }
  }

  static generate ({ attentionSchedule, interval, deadline }) {
    // Función que crea un array con todos los turnos y los devuelve
    // para posteriormente en otra función insertarlos en la bbdd
    const turns = []
    const currentDate = dayjs().startOf('day')

    attentionSchedule.forEach(day => {
      if (day.checked) {
        const dayIndex = day.dayIndex

        for (let date = currentDate.add(1, 'day'); date.isBefore(deadline); date = date.add(1, 'day')) {
          if (date.day() === dayIndex) {
            day.timeSlots.forEach(slot => {
              // horario: HH:mm => split[0] == horas - split[1] == minutos
              let startTime = date.hour(slot.start.split(':')[0]).minute(slot.start.split(':')[1])
              const endTime = date.hour(slot.end.split(':')[0]).minute(slot.end.split(':')[1])

              // Ajustar segundos a 0
              startTime = startTime.set('second', 0)
              while (startTime.isBefore(endTime)) {
                turns.push({
                  date: startTime.format('YYYY-MM-DD HH:mm:ss'),
                  day: day.day
                })
                startTime = startTime.add(interval, 'minute')
              }
            })
          }
        }
      }
    })

    return turns
  }

  static async filterAndDeleteTurns ({ currentTurns, newTurns }) {
    const newTurnDates = newTurns.map(turn => turn.date)

    // Los turnos que no corresponden a los nuevos horarios, los elimino
    const turnsToDelete = currentTurns.filter(turn => !newTurnDates.includes(turn.date_time) && turn.available)

    // Los turnos que corresponden a los nuevos horarios los mantengo
    const turnsToKeep = currentTurns.filter(turn => newTurnDates.includes(turn.date_time))

    if (turnsToDelete.length > 0) {
      const idsToDelete = turnsToDelete.map(turn => turn.id_turn)
      const query = 'DELETE FROM turns WHERE id_turn = ANY($1::uuid[])'
      await pool.query(query, [idsToDelete])
    }

    // Calculo los turnos a agregar a la BD, filtro los nuevos turnos con los que hay que mantener
    // para evitar duplicados
    const turnsToAdd = newTurns.filter(turn => !turnsToKeep.some(existingTurn => existingTurn.date_time === turn.date))

    return turnsToAdd
  }

  static async insertAll ({ turns }) {
    if (turns.length === 0) return

    const values = []
    const placeholders = turns.map((_, index) => `($${index + 1})`)

    for (const turn of turns) {
      const dateWithOffset = dayjs(turn.date).format('YYYY-MM-DD HH:mm:ss-03')
      values.push(dateWithOffset)
    }

    const query = `INSERT INTO turns (date_time) VALUES ${placeholders.join(', ')}`

    try {
      await pool.query(query, values)
    } catch (error) {
      throw new ConnectionError('Database is not available')
    }
  }

  static async request ({ turnId, userId, serviceId }) {
    const currentDate = dayjs().format('YYYY-MM-DD')
    const timeLimit = dayjs().add(12, 'hour').second(0).millisecond(0).format('YYYY-MM-DD HH:mm:ss')

    try {
      const turns = await pool.query(
        `SELECT *
          FROM turns
          WHERE id_turn = $1
          AND available = true
          AND DATE(date_time) > DATE($2)
          AND date_time >= $3;`,
        [turnId, currentDate, timeLimit]
      )

      if (turns.rowCount === 0) throw new NotAvailableError('Turn not available')

      await pool.query(
        `UPDATE turns SET available = false, user_id = $1, service_id = $2
          WHERE id_turn = $3;`,
        [userId, serviceId, turnId]
      )

      const turn = await pool.query(
        `SELECT id_turn, user_id AS id_user, service_id AS id_service, date_time
          FROM turns
          WHERE id_turn = $1;`,
        [turnId]
      )

      return {
        date_time: moment(turn.rows[0].date_time).tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DD HH:mm:ss'),
        id_turn: turn.rows[0].id_turn,
        id_user: turn.rows[0].id_user,
        id_service: turn.rows[0].id_service
      }
    } catch (error) {
      if (error instanceof NotAvailableError) throw error

      throw new ConnectionError('Database is not available')
    }
  }

  static async getUserTurns ({ userId }) {
    try {
      const turns = await pool.query(
        `SELECT t.id_turn, user_id AS id_user, u.name username, t.service_id AS id_service, s.name service, s.duration, s.price, t.date_time
          FROM turns t
          INNER JOIN users u ON t.user_id = u.id_user
          INNER JOIN services s ON t.service_id = s.id_service
          WHERE t.user_id = $1
          ORDER BY t.date_time ASC;`,
        [userId]
      )

      if (turns.rowCount === 0) throw new NotFoundError('You don´t have turns')

      const turnsWithLocalTime = turns.rows.map(turn => ({
        ...turn,
        date_time: moment(turn.date_time).tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DD HH:mm:ss'),
        date: moment(turn.date_time).tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DD'),
        time: moment(turn.date_time).tz('America/Argentina/Buenos_Aires').format('HH:mm')
      }))

      return turnsWithLocalTime
    } catch (error) {
      console.log(error)
      if (error instanceof NotFoundError) throw error

      throw new ConnectionError('Database is not available')
    }
  }

  static async cancel ({ turnId, userId }) {
    try {
      const turn = await pool.query(
        `SELECT id_turn, date_time
          FROM turns
          WHERE id_turn = $1
          AND user_id = $2
          AND available = false;`,
        [turnId, userId]
      )

      if (turn.rowCount === 0) throw new NotFoundError('Turn not found')

      const turnDate = dayjs(turn.rows[0].date_time)
      const currentDate = dayjs()
      const diffHours = turnDate.diff(currentDate, 'hour')

      if (diffHours <= 24) throw new UnauthorizedError('You cannot cancel the turn because the time limit has been exceeded')

      await pool.query(
        `UPDATE turns SET available = true, user_id = null, service_id = null
          WHERE id_turn = $1
          AND user_id = $2;`,
        [turnId, userId]
      )
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      if (error instanceof UnauthorizedError) throw error

      throw new ConnectionError('Database is not available')
    }
  }
}
