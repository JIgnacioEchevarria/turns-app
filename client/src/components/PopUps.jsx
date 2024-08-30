import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { useTurnStore } from '../store/turn'
import { useUserStore } from '../store/user'
import { useNavigate } from 'react-router-dom'

export const PopupAlert = ({ handleClosePopup, errorMessage }) => {
  const handleClickInside = (e) => {
    // Funcion para que cuando popup el modal no se cierre.
    e.stopPropagation()
  }

  return (
    <div onClick={handleClosePopup} className='container-popup'>
        <div onClick={handleClickInside} className='popup'>
            <ErrorOutlineIcon sx={{ fontSize: 80, color: '#3ea5ce' }} />
            <h2>Ups!!!</h2>
            <p>{errorMessage}</p>
            <button onClick={handleClosePopup}>Entendido</button>
        </div>
    </div>
  )
}

export const AnnularTurnPopUp = ({ close, idTurn }) => {
  const annularTurn = useTurnStore(state => state.annularTurn)
  const logout = useUserStore(state => state.logout)
  const navigate = useNavigate()
  const isLoading = useTurnStore(state => state.isLoading)

  const handleClickInside = (e) => {
    // Funcion para que cuando popup el modal no se cierre.
    e.stopPropagation()
  }

  const handleAnnularTurn = async () => {
    const status = await annularTurn(idTurn)
    if (status === 403) {
      const success = await logout()
      if (success) navigate('/login', { state: { accessDeniedMessage: 'Acceso denegado' } })
    } else if (status === 200) {
      window.location.reload()
    } else {
      close()
    }
  }

  return (
    <div onClick={close} className='container-popup-annularturn'>
      <div onClick={handleClickInside} className='popup-annularturn'>
        <h3>¿Seguro quieres anular el turno?</h3>
        <div className='popup-annularturn-buttons'>
          <button onClick={() => handleAnnularTurn()} className='popup-annularturn-primarybtn'>Confirmar</button>
          <button onClick={close} className='popup-annularturn-secondarybtn'>Cancelar</button>
        </div>
      </div>
    </div>
  )
}
