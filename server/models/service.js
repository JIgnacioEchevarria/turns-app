import { pool } from '../database/connectionPostgreSQL.js'
import { AlreadyExistsError, ConnectionError, NotAvailableError, NotFoundError } from '../errors.js'

export class ServiceModel {
  static async getAll () {
    try {
      const services = await pool.query(
        `SELECT id_service AS id, name, duration, price, is_active
          FROM services
          WHERE is_active = true;`
      )

      if (services.rows.length === 0) throw new NotAvailableError('No services available')

      return services.rows
    } catch (error) {
      if (error instanceof NotAvailableError) throw error

      throw new ConnectionError('Database is not available')
    }
  }

  static async create ({ info }) {
    const { name, duration, price } = info

    try {
      const service = await pool.query(
        `SELECT *
          FROM services
          WHERE name = $1
          AND is_active = true;`,
        [name]
      )

      if (service.rowCount > 0) throw new AlreadyExistsError('The service already exists')

      const result = await pool.query(
        `INSERT INTO services (name, duration, price)
          VALUES ($1, $2, $3)
          RETURNING id_service, name, duration, price, is_active;`,
        [name, duration, price]
      )

      const newService = result.rows[0]

      return {
        id: newService.id_service,
        name: newService.name,
        duration: newService.duration,
        price: newService.price,
        is_active: newService.is_active
      }
    } catch (error) {
      if (error instanceof AlreadyExistsError) throw error

      throw new ConnectionError('Database is not available')
    }
  }

  static async delete ({ id }) {
    try {
      const service = await pool.query(
        `SELECT id_service, name, duration, price, is_active
          FROM services
          WHERE id_service = $1
          AND is_active = true;`,
        [id]
      )

      if (service.rows.length === 0) throw new NotFoundError('Service not found')

      await pool.query(
        `UPDATE services
          SET is_active = false
          WHERE id_service = $1;`,
        [id]
      )
    } catch (error) {
      if (error instanceof NotFoundError) throw error

      throw new ConnectionError('Database is not available')
    }
  }

  static async update ({ id, info }) {
    try {
      const services = await pool.query(
        `SELECT *
          FROM services
          WHERE id_service = $1;`,
        [id]
      )

      if (services.rows.length === 0) throw new NotFoundError('Service not found')

      const { name, duration, price } = info

      if (name) {
        const existingService = await pool.query(
          `SELECT *
            FROM services
            WHERE name = $1
            AND id_service != $2
            AND is_active = true;`,
          [name, id]
        )

        if (existingService.rowCount > 0) throw new AlreadyExistsError('The service already exists')
      }

      // Se crean dos arrays, uno para los campos, y otro para los parametros.
      const updatedFields = []
      const updatedValues = []

      if (name) {
        updatedFields.push('name = $' + (updatedValues.length + 1))
        updatedValues.push(name)
      }

      if (duration) {
        updatedFields.push('duration = $' + (updatedValues.length + 1))
        updatedValues.push(duration)
      }

      if (price) {
        updatedFields.push('price = $' + (updatedValues.length + 1))
        updatedValues.push(price)
      }

      updatedValues.push(id)

      // Se crea la query.
      const updateQuery = `UPDATE services SET ${updatedFields.join(', ')} WHERE id_service = $${updatedValues.length}`

      // Se hace la conexión con la bbdd pasandole la query y los parametros.
      await pool.query(updateQuery, updatedValues)

      const updatedServices = await pool.query(
        `SELECT id_service AS id, name, duration, price, is_active
          FROM services
          WHERE id_service = $1;`,
        [id]
      )

      return updatedServices.rows[0]
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      if (error instanceof AlreadyExistsError) throw error

      throw new ConnectionError('Database is not available')
    }
  }
}
