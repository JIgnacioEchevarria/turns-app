import app from '../app.js'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

describe('User endpoints', () => {
  describe('User register', () => {
    it('should respond with status 201', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send({ name: 'miltonGomez', email: 'miltongomez34@gmail.com', password: 'chacabuco1892', passwordConfirm: 'chacabuco1892', phoneNum: '2389012368' })
      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('statusMessage', 'Successful Registration')
    })

    it('should respond with status 422 if data validation fails', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send({ name: 'miltonGomez', email: 432423, password: 'chacabuco1892', passwordConfirm: 'chacabuco1892', phoneNum: '2389012368' })
      expect(response.status).toBe(422)
      expect(response.body).toHaveProperty('statusMessage', 'Validation Error')
    })

    it('should respond status 409 if username already exists', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send({ name: 'juanPerez', email: 'miltongomez34@gmail.com', password: 'chacabuco1892', passwordConfirm: 'chacabuco1892', phoneNum: '2389012368' })
      expect(response.status).toBe(409)
      expect(response.body).toHaveProperty('statusMessage', 'Already Exists')
    })

    it('should respond status 409 if email already exists', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send({ name: 'miltonGomez', email: 'juanperez8912@gmail.com', password: 'chacabuco1892', passwordConfirm: 'chacabuco1892', phoneNum: '2389012368' })
      expect(response.status).toBe(409)
      expect(response.body).toHaveProperty('statusMessage', 'Already Exists')
    })
  })

  describe('Login', () => {
    it('should respond with status 200 if the user logs in successfully', async () => {
      const response = await request(app)
        .post('/api/v1/users/auth')
        .send({ email: 'juanperez8912@gmail.com', password: 'chacabuco1892' })
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('statusMessage', 'Successful Authentication')
    })

    it('should respond with status 401 if credentials are incorrect', async () => {
      const response = await request(app)
        .post('/api/v1/users/auth')
        .send({ email: 'juanperez8912@gmail.com', password: 'oscafeaf' })
      expect(response.status).toBe(401)
      expect(response.body).toHaveProperty('statusMessage', 'Invalid Credentials')
    })
  })

  describe('Logout', () => {
    it('should respond with status 200 if the logout is successfully', async () => {
      const response = await request(app)
        .post('/api/v1/users/logout')
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('statusMessage', 'Success')
    })
  })

  describe('Get all users', () => {
    let accessToken

    beforeAll(async () => {
      // Iniciar sesión para obtener la cookie de sesión
      const response = await request(app)
        .post('/api/v1/users/auth')
        .send({ email: 'nachoEchevarria@gmail.com', password: 'nacho_admin' })

      expect(response.status).toBe(200)
      accessToken = response.headers['set-cookie'].find(cookie => cookie.startsWith('access_token='))

      expect(accessToken).toBeDefined()
    })

    it('should respond with status 200 and a list of users', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('Cookie', accessToken)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('statusMessage', 'Success')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toBeInstanceOf(Array)
    })

    it('should respond with status 404 if no users exist', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('Cookie', accessToken)
      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('statusMessage', 'Not Found')
    })

    it('should respond with status 403 if the user is not logged in', async () => {
      const response = await request(app)
        .get('/api/v1/users')
      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('statusMessage', 'Access Not Authorized')
    })

    describe('Unauthorized access', () => {
      let accessToken

      beforeAll(async () => {
        // Iniciar sesión para obtener la cookie de sesión
        const response = await request(app)
          .post('/api/v1/users/auth')
          .send({ email: 'cabe92@gmail.com', password: 'chacabuco1892' })

        expect(response.status).toBe(200)
        accessToken = response.headers['set-cookie'].find(cookie => cookie.startsWith('access_token='))

        expect(accessToken).toBeDefined()
      })

      it('should respond with status 403 if the user is not an administrator', async () => {
        const response = await request(app)
          .get('/api/v1/users')
          .set('Cookie', accessToken)
        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('statusMessage', 'Access Not Authorized')
      })
    })
  })

  describe('Update profile info', () => {
    let accessToken

    beforeAll(async () => {
      // Iniciar sesión para obtener la cookie de sesión
      const response = await request(app)
        .post('/api/v1/users/auth')
        .send({ email: 'oscarsito@gmail.com', password: 'chacabuco1892' })

      expect(response.status).toBe(200)
      accessToken = response.headers['set-cookie'].find(cookie => cookie.startsWith('access_token='))

      expect(accessToken).toBeDefined()
    })

    afterAll(async () => {
      // Reseteo los datos a sus valores originales
      const response = await request(app)
        .patch('/api/v1/users')
        .send({ name: 'oscargurriti', phoneNum: '2489078390' })
        .set('Cookie', accessToken)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('statusMessage', 'Success')
    })

    it('should respond with status 200 if the profile is updated successfully', async () => {
      const response = await request(app)
        .patch('/api/v1/users')
        .send({ name: 'oscargurri', phoneNum: '2489078390' })
        .set('Cookie', accessToken)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('statusMessage', 'Success')
    })

    it('should respond with status 422 if data validation fails', async () => {
      const response = await request(app)
        .patch('/api/v1/users')
        .send({ name: 432424234234, phoneNum: '2489078390' })
        .set('Cookie', accessToken)
      expect(response.status).toBe(422)
      expect(response.body).toHaveProperty('statusMessage', 'Validation Error')
    })

    it('should respond with status 409 if the username already exists', async () => {
      const response = await request(app)
        .patch('/api/v1/users')
        .send({ name: 'juanPerez', phoneNum: '2489078390' })
        .set('Cookie', accessToken)
      expect(response.status).toBe(409)
      expect(response.body).toHaveProperty('statusMessage', 'Already Exists')
    })

    it('should respond with status 403 if the user is not logged in', async () => {
      const response = await request(app)
        .patch('/api/v1/users')
        .send({ name: 'fuaeuf8aeyf', phoneNum: '2489078690' })
      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('statusMessage', 'Access Not Authorized')
    })
  })

  describe('Update password', () => {
    let accessToken

    beforeAll(async () => {
      // Iniciar sesión para obtener la cookie de sesión
      const response = await request(app)
        .post('/api/v1/users/auth')
        .send({ email: 'jusep@gmail.com', password: 'chacabuco1892' })

      expect(response.status).toBe(200)
      accessToken = response.headers['set-cookie'].find(cookie => cookie.startsWith('access_token='))

      expect(accessToken).toBeDefined()
    })

    afterAll(async () => {
      // Reseteo datos al estado original
      const response = await request(app)
        .patch('/api/v1/users/password')
        .send({ currentPassword: 'jusepguti', newPassword: 'chacabuco1892', passwordConfirm: 'chacabuco1892' })
        .set('Cookie', accessToken)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('statusMessage', 'Success')
    })

    it('should respond with status 200 if the password is updated successfully', async () => {
      const response = await request(app)
        .patch('/api/v1/users/password')
        .send({ currentPassword: 'chacabuco1892', newPassword: 'jusepguti', passwordConfirm: 'jusepguti' })
        .set('Cookie', accessToken)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('statusMessage', 'Success')
    })

    it('should respond with status 422 if data validation fails', async () => {
      const response = await request(app)
        .patch('/api/v1/users/password')
        .send({ currentPassword: 'chacabuco1892', newPassword: 'fef', passwordConfirm: 'fef' })
        .set('Cookie', accessToken)
      expect(response.status).toBe(422)
      expect(response.body).toHaveProperty('statusMessage', 'Validation Error')
    })

    it('should respond with status 422 if passwords do not match', async () => {
      const response = await request(app)
        .patch('/api/v1/users/password')
        .send({ currentPassword: 'chacabuco1892', newPassword: 'faeujfuanef', passwordConfirm: 'jusepguti' })
        .set('Cookie', accessToken)
      expect(response.status).toBe(422)
      expect(response.body).toHaveProperty('statusMessage', 'Validation Error')
    })

    it('should respond with status 401 if the current password is incorrect', async () => {
      const response = await request(app)
        .patch('/api/v1/users/password')
        .send({ currentPassword: 'oscarsito', newPassword: 'jusepguti', passwordConfirm: 'jusepguti' })
        .set('Cookie', accessToken)
      expect(response.status).toBe(401)
      expect(response.body).toHaveProperty('statusMessage', 'Invalid Credentials')
    })

    it('should respond with status 403 if the user is not logged in', async () => {
      const response = await request(app)
        .patch('/api/v1/users/password')
        .send({ currentPassword: 'chacabuco1892', newPassword: 'jusepguti', passwordConfirm: 'jusepguti' })
      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('statusMessage', 'Access Not Authorized')
    })
  })

  describe('Change role', () => {
    let accessToken

    beforeAll(async () => {
      // Iniciar sesión para obtener la cookie de sesión
      const response = await request(app)
        .post('/api/v1/users/auth')
        .send({ email: 'nachoEchevarria@gmail.com', password: 'nacho_admin' })

      expect(response.status).toBe(200)
      accessToken = response.headers['set-cookie'].find(cookie => cookie.startsWith('access_token='))

      expect(accessToken).toBeDefined()
    })

    afterAll(async () => {
      // Luego de cambiar el rol a un usuario, se resetea al estado orginal
      const response = await request(app)
        .patch('/api/v1/users/role')
        .send({ id: '00c4731c-49ef-11ef-bd2f-b42e99d80da0', role: 'client' })
        .set('Cookie', accessToken)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('statusMessage', 'Success')
    })

    it('should respond with status 200 if the role is changed successfully', async () => {
      const response = await request(app)
        .patch('/api/v1/users/role')
        .send({ id: '00c4731c-49ef-11ef-bd2f-b42e99d80da0', role: 'admin' })
        .set('Cookie', accessToken)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('statusMessage', 'Success')
    })

    it('should respond with status 400 if some attribute is null', async () => {
      const response = await request(app)
        .patch('/api/v1/users/role')
        .send({ role: 'admin' })
        .set('Cookie', accessToken)
      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('statusMessage', 'Bad Request')
    })

    it('should respond with status 400 if role is invalid', async () => {
      const response = await request(app)
        .patch('/api/v1/users/role')
        .send({ id: '00c4731c-49ef-11ef-bd2f-b42e99d80da0', role: 'user' })
        .set('Cookie', accessToken)
      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('statusMessage', 'Bad Request')
    })

    it('should respond with status 403 if you want to modify your own role', async () => {
      const response = await request(app)
        .patch('/api/v1/users/role')
        .send({ id: '530fb8f4-341d-11ef-9533-b42e99d80da0', role: 'admin' })
        .set('Cookie', accessToken)
      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('statusMessage', 'Access Not Authorized')
    })

    it('should respond with status 403 if the user is not logged in', async () => {
      const response = await request(app)
        .patch('/api/v1/users/role')
        .send({ id: '00c4731c-49ef-11ef-bd2f-b42e99d80da0', role: 'admin' })
      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('statusMessage', 'Access Not Authorized')
    })

    describe('Unauthorized access', () => {
      let accessToken

      beforeAll(async () => {
        // Iniciar sesión para obtener la cookie de sesión
        const response = await request(app)
          .post('/api/v1/users/auth')
          .send({ email: 'cabe92@gmail.com', password: 'chacabuco1892' })

        expect(response.status).toBe(200)
        accessToken = response.headers['set-cookie'].find(cookie => cookie.startsWith('access_token='))

        expect(accessToken).toBeDefined()
      })

      it('should respond with status 403 if the user is not administrator', async () => {
        const response = await request(app)
          .patch('/api/v1/users/role')
          .send({ id: '00c4731c-49ef-11ef-bd2f-b42e99d80da0', role: 'admin' })
          .set('Cookie', accessToken)
        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('statusMessage', 'Access Not Authorized')
      })
    })
  })

  describe('Get profile info', () => {
    let accessToken

    beforeAll(async () => {
      // Iniciar sesión para obtener la cookie de sesión
      const response = await request(app)
        .post('/api/v1/users/auth')
        .send({ email: 'miloEchevarria@gmail.com', password: 'gordopikis' })

      expect(response.status).toBe(200)
      accessToken = response.headers['set-cookie'].find(cookie => cookie.startsWith('access_token='))

      expect(accessToken).toBeDefined()
    })

    it('should respond with status 200 and profile information', async () => {
      const response = await request(app)
        .get('/api/v1/users/info')
        .set('Cookie', accessToken)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('statusMessage', 'Success')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toBeTypeOf('object')
    })

    it('should respond with status 403 if the user is not logged in', async () => {
      const response = await request(app)
        .get('/api/v1/users/info')
      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('statusMessage', 'Access Not Authorized')
    })
  })
})

describe('Service endpoints', () => {
  describe('Get all services', () => {
    it('should respond with status 200 and list of services', async () => {
      const response = await request(app)
        .get('/api/v1/services')
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('statusMessage', 'Success')
    })

    it('should respond with status 404 if not found services', async () => {
      const response = await request(app)
        .get('/api/v1/services')
      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('statusMessage', 'Not Found')
    })
  })

  describe('Create service', () => {
    let accessToken

    beforeAll(async () => {
      // Iniciar sesión para obtener la cookie de sesión
      const response = await request(app)
        .post('/api/v1/users/auth')
        .send({ email: 'nachoEchevarria@gmail.com', password: 'nacho_admin' })

      expect(response.status).toBe(200)
      accessToken = response.headers['set-cookie'].find(cookie => cookie.startsWith('access_token='))

      expect(accessToken).toBeDefined()
    })

    it('should respond with status 201 and the information of the new service if it was created successfull', async () => {
      const response = await request(app)
        .post('/api/v1/services')
        .send({ name: 'servicionuevo33', duration: 30, price: 8000 })
        .set('Cookie', accessToken)
      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('statusMessage', 'Success')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toBeTypeOf('object')
    })

    it('should respond with status 422 if data validation fails', async () => {
      const response = await request(app)
        .post('/api/v1/services')
        .send({ name: 3232, duration: 30, price: 8000 })
        .set('Cookie', accessToken)
      expect(response.status).toBe(422)
      expect(response.body).toHaveProperty('statusMessage', 'Validation Error')
    })

    it('should respond with status 409 if service already exists', async () => {
      const response = await request(app)
        .post('/api/v1/services')
        .send({ name: 'Corte', duration: 30, price: 8000 })
        .set('Cookie', accessToken)
      expect(response.status).toBe(409)
      expect(response.body).toHaveProperty('statusMessage', 'Already Exists')
    })

    it('shoul respond with status 403 if the user is not logged in', async () => {
      const response = await request(app)
        .post('/api/v1/services')
        .send({ name: 'servicionuevo33', duration: 30, price: 8000 })
      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('statusMessage', 'Access Not Authorized')
    })

    describe('Unauthorized access', () => {
      let accessToken

      beforeAll(async () => {
        // Iniciar sesión para obtener la cookie de sesión
        const response = await request(app)
          .post('/api/v1/users/auth')
          .send({ email: 'cabe92@gmail.com', password: 'chacabuco1892' })

        expect(response.status).toBe(200)
        accessToken = response.headers['set-cookie'].find(cookie => cookie.startsWith('access_token='))

        expect(accessToken).toBeDefined()
      })

      it('should respond with status 403 if user is not administrator', async () => {
        const response = await request(app)
          .post('/api/v1/services')
          .send({ name: 'servicionuevo33', duration: 30, price: 8000 })
          .set('Cookie', accessToken)
        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('statusMessage', 'Access Not Authorized')
      })
    })
  })

  describe('Remove service', () => {
    let accessToken

    beforeAll(async () => {
      // Iniciar sesión para obtener la cookie de sesión
      const response = await request(app)
        .post('/api/v1/users/auth')
        .send({ email: 'nachoEchevarria@gmail.com', password: 'nacho_admin' })

      expect(response.status).toBe(200)
      accessToken = response.headers['set-cookie'].find(cookie => cookie.startsWith('access_token='))

      expect(accessToken).toBeDefined()
    })

    afterAll(async () => {
      // Vuelvo a agregar el servicio eliminado luego del test
      const response = await request(app)
        .post('/api/v1/services')
        .send({ name: 'Corte', duration: 30, price: 8000 })
        .set('Cookie', accessToken)
      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('statusMessage', 'Success')
    })

    it('should respond with status 200 if the service was successfully removed', async () => {
      const response = await request(app)
        .patch('/api/v1/services/d3cb158d-4b7d-11ef-99b3-b42e99d80da0/deactivate')
        .set('Cookie', accessToken)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('statusMessage', 'Success')
    })

    it('should respond with status 500 if the parameter id is invalid', async () => {
      const response = await request(app)
        .patch('/api/v1/services/nfeuhfbq/deactivate')
        .set('Cookie', accessToken)
      expect(response.status).toBe(500)
      expect(response.body).toHaveProperty('statusMessage', 'Failed Connection')
    })

    it('should respond with status 404 if service not found', async () => {
      const response = await request(app)
        .patch('/api/v1/services/1926a5c2-37e4-11ef-9533-b42e99d80da9/deactivate')
        .set('Cookie', accessToken)
      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('statusMessage', 'Not Found')
    })

    it('shoul respond with status 403 if the user is not logged in', async () => {
      const response = await request(app)
        .patch('/api/v1/services/n8rbn2r/deactivate')
      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('statusMessage', 'Access Not Authorized')
    })

    describe('Unauthorized access', () => {
      let accessToken

      beforeAll(async () => {
        // Iniciar sesión para obtener la cookie de sesión
        const response = await request(app)
          .post('/api/v1/users/auth')
          .send({ email: 'cabe92@gmail.com', password: 'chacabuco1892' })

        expect(response.status).toBe(200)
        accessToken = response.headers['set-cookie'].find(cookie => cookie.startsWith('access_token='))

        expect(accessToken).toBeDefined()
      })

      it('should respond with status 403 if user is not administrator', async () => {
        const response = await request(app)
          .patch('/api/v1/services/d3cb158d-4b7d-11ef-99b3-b42e99d80da0/deactivate')
          .set('Cookie', accessToken)
        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('statusMessage', 'Access Not Authorized')
      })
    })
  })

  describe('Edit service', () => {
    let accessToken

    beforeAll(async () => {
      // Iniciar sesión para obtener la cookie de sesión
      const response = await request(app)
        .post('/api/v1/users/auth')
        .send({ email: 'nachoEchevarria@gmail.com', password: 'nacho_admin' })

      expect(response.status).toBe(200)
      accessToken = response.headers['set-cookie'].find(cookie => cookie.startsWith('access_token='))

      expect(accessToken).toBeDefined()
    })

    afterAll(async () => {
      const response = await request(app)
        .patch('/api/v1/services/0533c164-4b7f-11ef-99b3-b42e99d80da0')
        .send({ name: 'Servicio de prueba' })
    })

    it('It should respond with status 200 and the service information if it was successfully modified', async () => {
      const response = await request(app)
        .patch('/api/v1/services/0533c164-4b7f-11ef-99b3-b42e99d80da0')
        .send({ name: 'nfeanf8ae', duration: 30, price: 8000 })
        .set('Cookie', accessToken)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('statusMessage', 'Success')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toBeTypeOf('object')
    })

    it('It should respond with status 422 if data validation fails', async () => {
      const response = await request(app)
        .patch('/api/v1/services/0533c164-4b7f-11ef-99b3-b42e99d80da0')
        .send({ name: 3434, duration: 30, price: 8000 })
        .set('Cookie', accessToken)
      expect(response.status).toBe(422)
      expect(response.body).toHaveProperty('statusMessage', 'Validation Error')
    })

    it('should respond with status 500 if the parameter id is invalid', async () => {
      const response = await request(app)
        .patch('/api/v1/services/nejhnf')
        .send({ name: 'nfeanf8ae', duration: 30, price: 8000 })
        .set('Cookie', accessToken)
      expect(response.status).toBe(500)
      expect(response.body).toHaveProperty('statusMessage', 'Failed Connection')
    })

    it('should respond with status 404 if service not found', async () => {
      const response = await request(app)
        .patch('/api/v1/services/9f760491-4ab9-11ef-bd2f-b42e99d80da0')
        .send({ name: 'nfeanf8ae', duration: 30, price: 8000 })
        .set('Cookie', accessToken)
      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('statusMessage', 'Not Found')
    })

    it('should respond with status 409 if service already exists', async () => {
      const response = await request(app)
        .patch('/api/v1/services/0533c164-4b7f-11ef-99b3-b42e99d80da0')
        .send({ name: 'Corte', duration: 30, price: 8000 })
        .set('Cookie', accessToken)
      expect(response.status).toBe(409)
      expect(response.body).toHaveProperty('statusMessage', 'Already Exists')
    })

    it('should respond with status 403 if user is not logged in', async () => {
      const response = await request(app)
        .patch('/api/v1/services/0533c164-4b7f-11ef-99b3-b42e99d80da0')
        .send({ name: 'nfeanf8ae', duration: 30, price: 8000 })
      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('statusMessage', 'Access Not Authorized')
    })

    describe('Unauthorized access', () => {
      let accessToken

      beforeAll(async () => {
        // Iniciar sesión para obtener la cookie de sesión
        const response = await request(app)
          .post('/api/v1/users/auth')
          .send({ email: 'cabe92@gmail.com', password: 'chacabuco1892' })

        expect(response.status).toBe(200)
        accessToken = response.headers['set-cookie'].find(cookie => cookie.startsWith('access_token='))

        expect(accessToken).toBeDefined()
      })

      it('should respond with status 403 if user is not administrator', async () => {
        const response = await request(app)
          .patch('/api/v1/services/0533c164-4b7f-11ef-99b3-b42e99d80da0')
          .send({ name: 'nfeanf8ae', duration: 30, price: 8000 })
          .set('Cookie', accessToken)
        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('statusMessage', 'Access Not Authorized')
      })
    })
  })
})

describe('Turn endpoints', () => {
  describe('Get turns by date', () => {
    it('should respond with status 200 and list of turns', async () => {
      const response = await request(app)
        .get('/api/v1/turns/2024-08-01/available')
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('statusMessage', 'Success')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toBeInstanceOf(Array)
    })

    it('should respond with status 404 if not found turns', async () => {
      const response = await request(app)
        .get('/api/v1/turns/2024-07-30/available')
      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('statusMessage', 'Not Available')
    })
  })

  describe('Get my turns', () => {
    let accessToken

    beforeAll(async () => {
      // Iniciar sesión para obtener la cookie de sesión
      const response = await request(app)
        .post('/api/v1/users/auth')
        .send({ email: 'miloEchevarria@gmail.com', password: 'gordopikis' })

      expect(response.status).toBe(200)
      accessToken = response.headers['set-cookie'].find(cookie => cookie.startsWith('access_token='))

      expect(accessToken).toBeDefined()
    })

    it('should respond with status 200 and list of turns', async () => {
      const response = await request(app)
        .get('/api/v1/turns/user')
        .set('Cookie', accessToken)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('statusMessage', 'Success')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toBeInstanceOf(Array)
    })

    it('should respond with status 403 if the user is not logged in', async () => {
      const response = await request(app)
        .get('/api/v1/turns/user')
      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('statusMessage', 'Access Not Authorized')
    })

    describe('Not found turns', () => {
      let accessToken

      beforeAll(async () => {
        // Iniciar sesión para obtener la cookie de sesión
        const response = await request(app)
          .post('/api/v1/users/auth')
          .send({ email: 'cabe92@gmail.com', password: 'chacabuco1892' })

        expect(response.status).toBe(200)
        accessToken = response.headers['set-cookie'].find(cookie => cookie.startsWith('access_token='))

        expect(accessToken).toBeDefined()
      })

      it('should respond with status 404 if not found turns', async () => {
        const response = await request(app)
          .get('/api/v1/turns/user')
          .set('Cookie', accessToken)
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('statusMessage', 'Not Found')
      })
    })
  })

  describe('Request turn', () => {
    let accessToken

    beforeAll(async () => {
      // Iniciar sesión para obtener la cookie de sesión
      const response = await request(app)
        .post('/api/v1/users/auth')
        .send({ email: 'miloEchevarria@gmail.com', password: 'gordopikis' })

      expect(response.status).toBe(200)
      accessToken = response.headers['set-cookie'].find(cookie => cookie.startsWith('access_token='))

      expect(accessToken).toBeDefined()
    })

    afterAll(async () => {
      const response = await request(app)
        .patch('/api/v1/turns/06173e67-4dd1-11ef-99b3-b42e99d80da0/status')
        .set('Cookie', accessToken)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('statusMessage', 'Success')
    })

    it('must respond with status 200 and turn information if the turn is requested successfully', async () => {
      const response = await request(app)
        .patch('/api/v1/turns?turnId=06173e67-4dd1-11ef-99b3-b42e99d80da0&serviceId=62201d26-4e7e-11ef-99b3-b42e99d80da0')
        .set('Cookie', accessToken)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('statusMessage', 'Success')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toBeTypeOf('object')
    })

    it('should respond with status 404 if the turn is not available', async () => {
      const response = await request(app)
        .patch('/api/v1/turns?turnId=061d1502-4dd1-11ef-99b3-b42e99d80da0&serviceId=62201d26-4e7e-11ef-99b3-b42e99d80da0')
        .set('Cookie', accessToken)
      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('statusMessage', 'Not Available')
    })

    it('should respond with status 400 if some parameter is null', async () => {
      const response = await request(app)
        .patch('/api/v1/turns')
        .set('Cookie', accessToken)
      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('statusMessage', 'Missing Parameters')
    })

    it('should respond with status 403 if the user is not logged in', async () => {
      const response = await request(app)
        .patch('/api/v1/turns?turnId=06173e67-4dd1-11ef-99b3-b42e99d80da0&serviceId=62201d26-4e7e-11ef-99b3-b42e99d80da0')
      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('statusMessage', 'Access Not Authorized')
    })

    it('should respond with status 500 if some parameter is invalid', async () => {
      const response = await request(app)
        .patch('/api/v1/turns?turnId=fnj8y2nf&serviceId=c8a7e641-4abb-11ef-bd2f-b42e99d80da0')
        .set('Cookie', accessToken)
      expect(response.status).toBe(500)
      expect(response.body).toHaveProperty('statusMessage', 'Failed Connection')
    })
  })

  describe('Cancel turn', () => {
    let accessToken

    beforeAll(async () => {
      // Iniciar sesión para obtener la cookie de sesión
      const response = await request(app)
        .post('/api/v1/users/auth')
        .send({ email: 'miloEchevarria@gmail.com', password: 'gordopikis' })

      expect(response.status).toBe(200)
      accessToken = response.headers['set-cookie'].find(cookie => cookie.startsWith('access_token='))

      expect(accessToken).toBeDefined()
    })

    afterAll(async () => {
      const response = await request(app)
        .patch('/api/v1/turns?turnId=06299ec6-4dd1-11ef-99b3-b42e99d80da0&serviceId=62201d26-4e7e-11ef-99b3-b42e99d80da0')
        .set('Cookie', accessToken)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('statusMessage', 'Success')
    })

    it('should respond with status 200 if the turn is canceled successfully', async () => {
      const response = await request(app)
        .patch('/api/v1/turns/06299ec6-4dd1-11ef-99b3-b42e99d80da0/status')
        .set('Cookie', accessToken)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('statusMessage', 'Success')
    })

    it('should respond with status 404 if the turn is not found', async () => {
      const response = await request(app)
        .patch('/api/v1/turns/31fcaade-4b60-11ef-bd2f-b42e99d80da1/status')
        .set('Cookie', accessToken)
      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('statusMessage', 'Not Found')
    })

    it('should respond with status 403 if the shift cannot be canceled because it exceeded the time limit', async () => {
      const response = await request(app)
        .patch('/api/v1/turns/062321e5-4dd1-11ef-99b3-b42e99d80da0/status')
        .set('Cookie', accessToken)
      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('statusMessage', 'For Bidden Error')
    })

    it('should respond with status 403 if the user is not logged in', async () => {
      const response = await request(app)
        .patch('/api/v1/turns/06299ec6-4dd1-11ef-99b3-b42e99d80da0/status')
      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('statusMessage', 'Access Not Authorized')
    })

    it('should respond with status 500 if the parameter is invalid', async () => {
      const response = await request(app)
        .patch('/api/v1/turns/fa8fhf243u/status')
        .set('Cookie', accessToken)
      expect(response.status).toBe(500)
      expect(response.body).toHaveProperty('statusMessage', 'Failed Connection')
    })
  })

  describe('Get registered turns', () => {
    let accessToken

    beforeAll(async () => {
      // Iniciar sesión para obtener la cookie de sesión
      const response = await request(app)
        .post('/api/v1/users/auth')
        .send({ email: 'nachoEchevarria@gmail.com', password: 'nacho_admin' })

      expect(response.status).toBe(200)
      accessToken = response.headers['set-cookie'].find(cookie => cookie.startsWith('access_token='))

      expect(accessToken).toBeDefined()
    })

    it('should respond with status 200 and list of turns', async () => {
      const response = await request(app)
        .get('/api/v1/turns/2024-07-29/registered')
        .set('Cookie', accessToken)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('statusMessage', 'Success')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toBeInstanceOf(Array)
    })

    it('should respond with status 404 if no turns are found', async () => {
      const response = await request(app)
        .get('/api/v1/turns/2024-07-28/registered')
        .set('Cookie', accessToken)
      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('statusMessage', 'Not Found')
    })

    it('should respond with status 403 if the user is not logged in', async () => {
      const response = await request(app)
        .get('/api/v1/turns/2024-07-29/registered')
      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('statusMessage', 'Access Not Authorized')
    })

    describe('Unauthorized access', () => {
      let accessToken

      beforeAll(async () => {
        // Iniciar sesión para obtener la cookie de sesión
        const response = await request(app)
          .post('/api/v1/users/auth')
          .send({ email: 'miloEchevarria@gmail.com', password: 'gordopikis' })

        expect(response.status).toBe(200)
        accessToken = response.headers['set-cookie'].find(cookie => cookie.startsWith('access_token='))

        expect(accessToken).toBeDefined()
      })

      it('should respond with status 403 if the user is not administrator', async () => {
        const response = await request(app)
          .get('/api/v1/turns/2024-07-29/registered')
          .set('Cookie', accessToken)
        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('statusMessage', 'Access Not Authorized')
      })
    })
  })
})
