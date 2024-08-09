import { Avatar, Divider } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import DateRangeIcon from '@mui/icons-material/DateRange'
import PersonIcon from '@mui/icons-material/Person'
import StoreIcon from '@mui/icons-material/Store'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import AppRegistrationIcon from '@mui/icons-material/AppRegistration'
import LoginIcon from '@mui/icons-material/Login'
import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useUserStore } from '../store/user'
import { ROLES } from '../constants/roles.js'

export const NavigationMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const userInfo = useUserStore(state => state.userInfo)
  const logout = useUserStore(state => state.logout)
  const navigate = useNavigate()
  const location = useLocation()

  const handleOpenMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleLogout = async () => {
    const success = await logout()
    if (success) navigate('/login')
  }

  useEffect(() => {
    // Cierra el menú cuando cambia de página
    setIsOpen(false)
  }, [location.pathname])

  useEffect(() => {
    function handleClickOutside (event) {
      if (!event.target.closest('.menu') && !event.target.closest('.header-avatar')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <>
      <div className='header-avatar' onClick={handleOpenMenu}>
        {userInfo && <p>{userInfo.name}</p>}
        <Avatar />
      </div>
      {isOpen && (
        <div className='menu'>
          {userInfo && (
            <>
                <ul className='menu-list'>
                  <ul className='menu-list'>
                    <li className='menu-item menu-item-username'>
                      <Link><span>{userInfo.name}</span></Link>
                    </li>
                    <li className='menu-item'>
                      <Link to={'/account/profile'}><PersonIcon style={{ color: 'grey' }} /> <span>Mi perfil</span></Link>
                    </li>
                    <li className='menu-item'>
                      <Link to={'/account/my-turns'}><DateRangeIcon style={{ color: 'grey' }} /> <span>Mis turnos</span></Link>
                    </li>
                    {(userInfo.role === ROLES.ADMIN || userInfo.role === ROLES.EMPLOYEE) &&
                      <li className='menu-item'>
                        <a>
                          <StoreIcon style={{ color: 'grey' }} /> <span>Administración</span>
                          <ArrowForwardIosIcon className='menu-item-arrow' sx={{ fontSize: '1rem' }} />
                          <input type="checkbox" className='submenu-check' />
                        </a>
                        <ul className='submenu'>
                          <li className='submenu-item'><Link to={'/administration/turns'}><span>Turnos agendados</span></Link></li>
                          <li className='submenu-item'><Link to={'/administration/services'}><span>Servicios</span></Link></li>
                          <li className='submenu-item'><Link to={'/administration/users'}><span>Usuarios</span></Link></li>
                          {userInfo.role === ROLES.ADMIN && <li className='submenu-item'><Link to={'/administration/calendar'}><span>Configurar calendario</span></Link></li>}
                        </ul>
                      </li>
                    }
                  </ul>
                </ul>
                <Divider />
                <ul className='menu-list'>
                    <li className='menu-item' onClick={handleLogout}>
                      <a href="#"><LogoutIcon style={{ color: 'grey' }} /> <span>Cerrar sesión</span></a>
                    </li>
                </ul>
            </>
          )}
          {!userInfo && (
            <ul className='menu-list'>
                <li className='menu-item'><Link to={'/login'}><LoginIcon style={{ color: 'grey' }} /> <span>Iniciar sesión</span></Link></li>
                <li className='menu-item'><Link to={'/registration'}><AppRegistrationIcon style={{ color: 'grey' }} /> <span>Crear una cuenta</span></Link></li>
            </ul>
          )}
        </div>
      )}
    </>
  )
}
