import './Form.css'
import { useUserStore } from '../store/user'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { useEffect } from 'react'
import { FormErrorMessage } from '../components/FormErrorMessage'

export const RegistrationPage = () => {
  const register = useUserStore(state => state.register)
  const isLoading = useUserStore(state => state.isLoading)
  const navigate = useNavigate()
  const location = useLocation()
  const userError = useUserStore(state => state.userError)
  const resetUserErrors = useUserStore(state => state.resetUserErrors)
  const currentPath = window.location.pathname

  useEffect(() => {
    resetUserErrors()
  }, [location.pathname])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)

    const name = formData.get('username')
    const email = formData.get('email')
    const password = formData.get('password')
    const passwordConfirm = formData.get('passwordConfirm')
    const phoneNum = formData.get('phoneNum')

    // Si no hay errores se continua con el registro.
    const success = await register({ name, email, password, passwordConfirm, phoneNum })
    if (success) navigate('/login', { state: { successMessage: 'Gracias por crear una cuenta, ya puedes iniciar sesión' } })
  }

  const handleClosePopupError = () => {
    resetUserErrors()
  }

  const emailError = userError && userError.statusMessage === 'Validation Error' && userError.error.find(e => e.field === 'email')
  const passwordError = userError && userError.statusMessage === 'Validation Error' && userError.error.find(e => e.field === 'password')
  const phoneError = userError && userError.statusMessage === 'Validation Error' && userError.error.find(e => e.field === 'phoneNum')

  return (
    <div className="registration-page">
      {isLoading &&
        <div className='loading'>
          <CircularProgress size={80} className='loading-circle' />
        </div>
      }
      <div className='tabs-menu'>
        <Link
          className={currentPath === '/login' ? 'tabs-menu-options selected' : 'tabs-menu-options'}
          to={'/login'}
        >
          Iniciar sesión
        </Link>
        <Link
          className={currentPath === '/registration' ? 'tabs-menu-options selected' : 'tabs-menu-options'}
          to={'/registration'}
        >
          Registrarme
        </Link>
      </div>
      <h1>Registrarme</h1>
      <form className='form' onSubmit={handleSubmit}>
        <div className="form-item">
          <label htmlFor="email">E-mail</label>
          <input id='email' autoComplete='email' type='email' name="email" required />
          {emailError && <FormErrorMessage message={emailError.message} />}
        </div>
        <div className="form-item">
          <label htmlFor="password">Contraseña</label>
          <input id='password' type="password" name="password" required />
          <p className='input-help'>Mínimo 8 caracteres</p>
          {passwordError && <FormErrorMessage message={passwordError.message} />}
        </div>
        <div className="form-item">
          <label htmlFor="password-confirm">Confirmar Contraseña</label>
          <input id='password-confirm' type="password" name="passwordConfirm" required />
        </div>
        <div className="form-item">
          <label htmlFor="username">Nombre de usuario</label>
          <input id='username' autoComplete='username' type="text" name="username" required />
          {userError && userError.error === 'There is already a user with that username' && <FormErrorMessage message={userError.error} />}
        </div>
        <div className="form-item">
          <label htmlFor="phone-number">Número de teléfono</label>
          <input id='phone-number' type="tel" name="phoneNum" required />
          <p className='input-help'>Ingresá la característica (sin el cero inicial) y luego el número (sin el 15 inicial)</p>
          {phoneError && <FormErrorMessage message={phoneError.message} />}
        </div>
        <input className='form-btn form-btn-main' type="submit" value="Registrarme" />
      </form>
      {userError && userError.error === 'There is already a user with that email' &&
        <div className='container-popup-register'>
          <div className='popup-register'>
            <ErrorOutlineIcon sx={{ fontSize: 80, color: '#3ea5ce' }} />
            <h2>Ya existe una cuenta con ese e-mail</h2>
            <p>Si ya tenes una cuenta, no necesitás crear una nueva, iniciá sesión con ese e-mail</p>
            <div className='popup-register-buttons'>
              <Link onClick={handleClosePopupError} className='popup-register-btn-login' to={'/login'}>Iniciar sesión</Link>
              <Link onClick={handleClosePopupError} className='popup-register-btn-registration' to={'/registration'}>Usar otro e-mail</Link>
            </div>
          </div>
      </div>
      }
    </div>
  )
}
