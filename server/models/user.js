import { pool } from '../database/connectionPostgreSQL.js'
import bcrypt from 'bcrypt'
import { generateAccessToken } from '../utils/authorization.js'
import { AlreadyExistsError, ConnectionError, InvalidCredentialsError, NotFoundError } from '../errors.js'

export class UserModel {
  static async getAll () {
    try {
      const users = await pool.query(
        `SELECT id_user AS id, name, email, phone_number, role
          FROM users;`
      )

      if (users.rows.length === 0) throw new NotFoundError('No users found')

      return users.rows
    } catch (error) {
      if (error instanceof NotFoundError) throw error

      throw new ConnectionError('Database is not available')
    }
  }

  static async getById ({ id }) {
    try {
      const users = await pool.query(
        `SELECT id_user, name, email, phone_number, role
          FROM users
          WHERE id_user = $1;`,
        [id]
      )

      if (users.rows.length === 0) throw new NotFoundError('User not found')

      return users.rows
    } catch (error) {
      if (error instanceof NotFoundError) throw error

      throw new ConnectionError('Database is not available')
    }
  }

  static async create ({ info }) {
    const { name, email, password, phoneNum } = info

    try {
      const nameVerification = await pool.query(
        `SELECT COUNT(*) AS count
          FROM users
          WHERE name = $1;`,
        [name]
      )

      const emailVerification = await pool.query(
        `SELECT COUNT(*) AS count
          FROM users
          WHERE email = $1;`,
        [email]
      )

      if (nameVerification.rows > 0) throw new AlreadyExistsError('There is already a user with that username')
      if (emailVerification.rows > 0) throw new AlreadyExistsError('There is already a user with that email')

      const role = 'client'

      const hashedPassword = await bcrypt.hash(password, 10)

      await pool.query(
        `INSERT INTO users (name, email, password, phone_number, role)
          VALUES ($1, $2, $3, $4, $5);`,
        [name, email, hashedPassword, phoneNum, role]
      )
    } catch (error) {
      if (error instanceof AlreadyExistsError) throw error

      throw new ConnectionError('Database is not available')
    }
  }

  static async login ({ email, password }) {
    try {
      const users = await pool.query(
        `SELECT id_user, name, email, password, phone_number, role
          FROM users
          WHERE email = $1;`,
        [email]
      )

      if (users.rows.length === 0) throw new InvalidCredentialsError('Invalid password or email')

      const user = users.rows[0]

      const validPassword = await bcrypt.compare(password, user.password)
      if (!validPassword) throw new InvalidCredentialsError('Invalid password or email')

      const userLogged = {
        id: user.id_user,
        name: user.name,
        email: user.email,
        phoneNumber: user.phone_number,
        role: user.role
      }

      const token = generateAccessToken(userLogged)
      return {
        token,
        userLogged
      }
    } catch (error) {
      console.log(error)
      if (error instanceof InvalidCredentialsError) throw error

      throw new ConnectionError('Database is not available')
    }
  }

  static async update ({ id, info }) {
    try {
      const users = await pool.query(
        `SELECT *
          FROM users
          WHERE id_user = $1;`,
        [id]
      )

      if (users.rows.length === 0) throw new NotFoundError('We did not find a user with that data')

      const { name, phoneNum } = info

      const nameVerification = await pool.query(
        `SELECT COUNT(*) AS count
          FROM users
          WHERE name = $1
          AND id_user != $2;`,
        [name, id]
      )

      if (parseInt(nameVerification.rows[0].count) > 0) throw new AlreadyExistsError('There is already a user with that username')

      // Se crean dos arrays, uno para los campos, y otro para los parametros.
      const updatedFields = []
      const updatedValues = []

      if (name) {
        updatedFields.push('name = $' + (updatedValues.length + 1))
        updatedValues.push(name)
      }

      if (phoneNum) {
        updatedFields.push('phone_number = $' + (updatedValues.length + 1))
        updatedValues.push(phoneNum)
      }

      updatedValues.push(id)

      const updateQuery = `UPDATE users SET ${updatedFields.join(', ')} WHERE id_user = $${updatedValues.length};`

      await pool.query(updateQuery, updatedValues)

      const updatedUser = await pool.query(
        `SELECT id_user, name, email, phone_number, role
          FROM users
          WHERE id_user = $1;`,
        [id]
      )

      return {
        id: updatedUser.rows[0].id_user,
        name: updatedUser.rows[0].name,
        email: updatedUser.rows[0].email,
        phoneNumber: updatedUser.rows[0].phone_number,
        role: updatedUser.rows[0].role
      }
    } catch (error) {
      if (error instanceof NotFoundError) throw error

      if (error instanceof AlreadyExistsError) throw error

      throw new ConnectionError('Database is not available')
    }
  }

  static async editPassword ({ id, info }) {
    const { currentPassword, newPassword } = info

    try {
      const users = await pool.query(
        `SELECT id_user, name, email, password, phone_number, role
          FROM users
          WHERE id_user = $1;`,
        [id]
      )

      if (users.rows.length === 0) throw new NotFoundError('User not found')

      const hashedPasswordFromDatabase = users.rows[0].password

      // Compara la contraseña de la base de datos con la ingresada por el usuario (actual)
      const passwordMatch = await bcrypt.compare(currentPassword, hashedPasswordFromDatabase)

      if (!passwordMatch) throw new InvalidCredentialsError('Incorrect password')

      // Hashea contraseña nueva
      const hashedNewPassword = await bcrypt.hash(newPassword, 10)

      await pool.query('UPDATE users SET password = $1 WHERE id_user = $2', [hashedNewPassword, id])
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      if (error instanceof InvalidCredentialsError) throw error

      throw new ConnectionError('Database is not available')
    }
  }

  static async changeRole ({ id, role }) {
    try {
      const users = await pool.query(
        `SELECT id_user, name, email, phone_number, role
          FROM users
          WHERE id_user = $1`,
        [id]
      )

      if (users.rows.length === 0) throw new NotFoundError('User not found')

      await pool.query('UPDATE users SET role = $1 WHERE id_user = $2', [role, id])
    } catch (error) {
      if (error instanceof NotFoundError) throw error

      throw new ConnectionError('Database is not available')
    }
  }
}
