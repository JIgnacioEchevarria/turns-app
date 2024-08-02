import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useUserStore } from '../store/user'
import CircularProgress from '@mui/material/CircularProgress'
import { FormErrorMessage } from '../components/FormErrorMessage'
import './MyAccount.css'

export const EditPasswordPage = () => {
  const editPassword = useUserStore(state => state.editPassword)
  const isLoading = useUserStore(state => state.isLoading)
  const userError = useUserStore(state => state.userError)
  const logout = useUserStore(state => state.logout)
  const resetUserErrors = useUserStore(state => state.resetUserErrors)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    resetUserErrors()
  }, [location.pathname])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)

    const currentPassword = formData.get('current-password')
    const newPassword = formData.get('new-password')
    const passwordConfirm = formData.get('password-confirm')

    const status = await editPassword({ currentPassword, newPassword, passwordConfirm })
    if (status === 200) {
      navigate('/account/profile', { state: { successMessage: 'Contraseña actualizada correctamente.' } })
    } else if (status === 403) {
      const success = await logout()
      if (success) navigate('/login', { state: { accessDeniedMessage: 'Acceso denegado' } })
    }
  }

  const passwordError = userError && userError.statusMessage === 'Validation Error' && userError.error.find(e => e.field === 'password')

  return (
    <div className="edituser-page">
      {isLoading &&
        <div className='loading'>
          <CircularProgress size={80} className='loading-circle' />
        </div>
      }
      <div className="back-link">
        <Link to={'/account/profile'}>Mi cuenta</Link>
      </div>
      <h1 className="section-title">Cambiar contraseña</h1>
      <form onSubmit={handleSubmit} className='edituser-form'>
        <div className="edituser-form-item">
          <label htmlFor="current-password">Contraseña actual</label>
          <input type='password' id='current-password' name="current-password" required />
          {userError && userError.statusMessage === 'Invalid Credentials' &&
            <FormErrorMessage message={userError.error} />
          }
        </div>
        <div className="edituser-form-item">
          <label htmlFor="new-password">Nueva contraseña</label>
          <input id='new-password' type='password' name="new-password" required />
          <p className='input-help'>La contraseña debe tener al menos 8 caracteres</p>
          {passwordError && <FormErrorMessage message={passwordError.message} />}
        </div>
        <div className="edituser-form-item">
          <label htmlFor="password-confirm">Confirmar nueva contraseña</label>
          <input id='password-confirm' type='password' name="password-confirm" required />
        </div>
        <input className='edituser-form-btn' type="submit" value='Guardar nueva contraseña' />
      </form>
    </div>
  )
}

export const EditProfilePage = () => {
  const update = useUserStore(state => state.update)
  const userInfo = useUserStore(state => state.userInfo)
  const isLoading = useUserStore(state => state.isLoading)
  const userError = useUserStore(state => state.userError)
  const logout = useUserStore(state => state.logout)
  const resetUserErrors = useUserStore(state => state.resetUserErrors)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    resetUserErrors()
  }, [location.pathname])

  const [formData, setFormData] = useState({
    username: userInfo ? userInfo.name : '',
    phoneNumber: userInfo ? userInfo.phoneNumber : ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)

    const name = formData.get('username')
    const phoneNum = formData.get('phoneNumber')

    if (name === userInfo.name && phoneNum === userInfo.phoneNumber) return

    const status = await update({ name, phoneNum })
    if (status === 200) {
      navigate('/account/profile', { state: { successMessage: 'Perfil actualizado correctamente.' } })
    } else if (status === 403) {
      const success = await logout()
      if (success) navigate('/login', { state: { accessDeniedMessage: 'Acceso denegado' } })
    }
  }

  const handleChangeInput = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const phoneError = userError && userError.statusMessage === 'Validation Error' && userError.error.find(e => e.field === 'phoneNum')

  return (
    <div className="edituser-page">
      {isLoading &&
        <div className='loading'>
          <CircularProgress size={80} className='loading-circle' />
        </div>
      }
      <div className="back-link">
        <Link to={'/account/profile'}>Mi cuenta</Link>
      </div>
      <h1>Editar mi perfil</h1>
      <form onSubmit={handleSubmit} className='edituser-form'>
        <div className="edituser-form-item">
          <label htmlFor="username">Nombre de usuario</label>
          <input id='username' autoComplete='username' type='text' name="username" value={formData.username} onChange={handleChangeInput} required />
          {userError && userError.error === 'There is already a user with that username' && <FormErrorMessage message={userError.error} />}
        </div>
        <div className="edituser-form-item">
          <label htmlFor="phone-number">Télefono</label>
          <input id='phone-number' type='tel' name="phoneNumber" value={formData.phoneNumber} onChange={handleChangeInput} required />
          <p className='input-help'>Ingresá la característica (sin el cero inicial) y luego el número (sin el 15 inicial)</p>
          {phoneError && <FormErrorMessage message={phoneError.message} />}
        </div>
        <input className='edituser-form-btn' type="submit" value='Guardar cambios' />
      </form>
    </div>
  )
}
