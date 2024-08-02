import { Link, useLocation } from 'react-router-dom'
import { useUserStore } from '../store/user'
import './MyAccount.css'

export const MyProfilePage = () => {
  const userInfo = useUserStore(state => state.userInfo)
  const location = useLocation()

  return (
    <div className="profile-info">
        {location && location.state && location.state.successMessage &&
          <p className='update-profile-success'>{location.state.successMessage}</p>
        }
        <div className="profile-info-card">
          <h2>Datos de inicio de sesión</h2>
          <p><span>Email:</span> {userInfo.email}</p>
          <p className="profile-info-password"><span>Contraseña</span> <Link to={'/account/edit-password'}>Cambiar contraseña</Link></p>
        </div>
        <div className="profile-info-card">
          <div>
            <h2>Datos personales y contacto</h2>
            <Link to={'/account/edit-profile'}>Editar</Link>
          </div>
          <p><span>Nombre de usuario:</span> {userInfo.name}</p>
          <p><span>Télefono:</span> {userInfo.phoneNumber}</p>
        </div>
    </div>
  )
}
