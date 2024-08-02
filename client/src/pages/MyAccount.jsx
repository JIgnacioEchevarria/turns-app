import './MyAccount.css'
import { MyProfilePage } from './MyProfile'
import { MyTurnsPage } from './MyTurns'
import { Link } from 'react-router-dom'
import { useTurnStore } from '../store/turn'
import CircularProgress from '@mui/material/CircularProgress'
import { turnErrorMessages } from '../constants/messages.js'
import { PopupAlert } from '../components/PopUps.jsx'

export const MyAccountPage = () => {
  const currentPath = window.location.pathname
  const isLoading = useTurnStore(state => state.isLoading)
  const turnError = useTurnStore(state => state.turnError)
  const resetTurnErrors = useTurnStore(state => state.resetTurnErrors)

  const handleClosePopUpTurnError = () => {
    resetTurnErrors()
  }

  return (
    <div className="my-accountpage">
        {isLoading &&
          <div className='loading'>
            <CircularProgress size={80} className='loading-circle' />
          </div>
        }
        {!isLoading && turnError && turnError.statusMessage === 'For Bidden Error' &&
          <PopupAlert handleClosePopup={handleClosePopUpTurnError} errorMessage={turnErrorMessages(turnError.error)} />
        }
        <h1 className='section-title'>Mi cuenta</h1>
        <div className='tabs-menu'>
            <Link
              className={currentPath === '/account/profile' ? 'tabs-menu-options selected' : 'tabs-menu-options'}
              to={'/account/profile'}
            >
              Mi perfil
            </Link>
            <Link
              className={currentPath === '/account/my-turns' ? 'tabs-menu-options selected' : 'tabs-menu-options'}
              to={'/account/my-turns'}
            >
              Mis turnos
            </Link>
        </div>
        {currentPath === '/account/profile'
          ? <MyProfilePage />
          : <MyTurnsPage />
        }
    </div>
  )
}
