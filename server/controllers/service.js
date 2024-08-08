import { AlreadyExistsError, ConnectionError, NotAvailableError, NotFoundError } from '../errors.js'
import { validatePartialService, validateService } from '../schemes/schemes.js'
import { isValidUuid } from '../utils/validation.js'

export class ServiceController {
  constructor ({ serviceModel }) {
    this.serviceModel = serviceModel
  }

  getAll = async (req, res) => {
    try {
      const services = await this.serviceModel.getAll()

      return res.status(200).json({ status: 200, statusMessage: 'Success', data: services })
    } catch (error) {
      if (error instanceof NotAvailableError) {
        return res.status(404).json({ status: 404, statusMessage: 'Not Available', error: error.message })
      }

      if (error instanceof ConnectionError) {
        return res.status(500).json({ status: 500, statusMessage: 'Failed Connection', error: error.message })
      }
    }
  }

  create = async (req, res) => {
    try {
      const result = validateService(req.body)

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

      const info = result.data

      const newService = await this.serviceModel.create({ info })

      return res.status(201).json({ status: 201, statusMessage: 'Success', data: newService })
    } catch (error) {
      if (error instanceof AlreadyExistsError) {
        return res.status(409).json({ status: 409, statusMessage: 'Already Exists', error: error.message })
      }

      if (error instanceof ConnectionError) {
        return res.status(500).json({ status: 500, statusMessage: 'Failed Connection', error: error.message })
      }
    }
  }

  delete = async (req, res) => {
    try {
      const id = req.params.id

      if (!isValidUuid(id)) return res.status(400).json({ status: 400, statusMessage: 'Bad Request', error: 'Invalid service ID provided' })

      await this.serviceModel.delete({ id })
      return res.status(200).json({ status: 200, statusMessage: 'Success' })
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ status: 404, statusMessage: 'Not Found', error: error.message })
      }

      if (error instanceof ConnectionError) {
        return res.status(500).json({ status: 500, statusMessage: 'Failed Connection', error: error.message })
      }
    }
  }

  update = async (req, res) => {
    try {
      const result = validatePartialService(req.body)

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

      const id = req.params.id
      const info = result.data

      if (!isValidUuid(id)) return res.status(400).json({ status: 400, statusMessage: 'Bad Request', error: 'Invalid service ID provided' })

      const updatedService = await this.serviceModel.update({ id, info })

      return res.status(200).json({
        status: 200,
        statusMessage: 'Success',
        data: updatedService
      })
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ status: 404, statusMessage: 'Not Found', error: error.message })
      }

      if (error instanceof AlreadyExistsError) {
        return res.status(409).json({ status: 409, statusMessage: 'Already Exists', error: error.message })
      }

      if (error instanceof ConnectionError) {
        return res.status(500).json({ status: 500, statusMessage: 'Failed Connection', error: error.message })
      }
    }
  }
}
