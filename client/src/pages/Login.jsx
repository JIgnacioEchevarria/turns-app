import { useUserStore } from '../store/user'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import CircularProgress from '@mui/material/CircularProgress'
import './Form.css'
import { userErrorMessages } from '../constants/messages.js'
import { useEffect } from 'react'

export const LoginPage = () => {
  const login = useUserStore(state => state.login)
  const isLoading = useUserStore(state => state.isLoading)
  const userError = useUserStore(state => state.userError)
  const resetUserErrors = useUserStore(state => state.resetUserErrors)
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = window.location.pathname

  useEffect(() => {
    resetUserErrors()
  }, [location.pathname])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)

    const email = formData.get('email')
    const password = formData.get('password')

    const success = await login({ email, password })
    if (success) navigate('/')
  }

  return (
    <div className="login-page">
      {isLoading &&
        <div className='loading'>
          <CircularProgress size={80} className='loading-circle' />
        </div>
      }
      {location && location.state && location.state.accessDeniedMessage &&
        <div className='access-denied-msg'>
          <ErrorOutlineIcon sx={{ fontSize: 30, color: '#DC3545' }} />
          <p>{location.state.accessDeniedMessage}</p>
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
      <h1>Iniciar sesión</h1>
      {userError &&
        <div className='form-error'>
          <ErrorOutlineIcon sx={{ fontSize: 30, color: '#991B1B' }} />
          <p>{userErrorMessages(userError.error)}</p>
        </div>
      }
      {location && location.state && location.state.successMessage &&
        <div className='form-success'>
          <p>{location.state.successMessage}</p>
        </div>
      }
      <form className='form' onSubmit={handleSubmit}>
        <div className="form-item">
          <label htmlFor="email">Email</label>
          <input style={ userError && { border: '1px solid #DC2626' } } id='email' autoComplete='email' type='email' name="email" required />
        </div>
        <div className="form-item">
          <label htmlFor="password">Contraseña</label>
          <input style={ userError && { border: '1px solid #DC2626' } } id='password' type="password" name="password" required />
        </div>
        <input className='form-btn form-btn-main' type="submit" value="Iniciar sesión" />
      </form>
    </div>
  )
}
