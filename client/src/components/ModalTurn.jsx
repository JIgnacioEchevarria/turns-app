import CloseIcon from '@mui/icons-material/Close'
import { turnDuration } from '../utils/turnUtils'
import { useTurnStore } from '../store/turn'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useUserStore } from '../store/user'

export const ModalTurn = ({ info, handleToggleModalTurn }) => {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const requestTurn = useTurnStore(state => state.requestTurn)
  const logout = useUserStore(state => state.logout)
  const navigate = useNavigate()

  const handleClickInside = (e) => {
    // Funcion para que cuando clickee el modal no se cierre.
    e.stopPropagation()
  }

  const handleRequestTurn = async () => {
    const status = await requestTurn({ turn: info.turn.id_turn, service: info.service.id })
    if (status === 200) {
      setShowConfirmation(true)
    } else if (status === 403) {
      const success = await logout()
      if (success) navigate('/login', { state: { accessDeniedMessage: 'Acceso denegado' } })
    }
  }

  const handleCloseConfirmationTurn = () => {
    window.location.reload()
  }

  return (
    <div onClick={handleToggleModalTurn} className='backdrop-modal-turn'>
        <div onClick={handleClickInside} className='modal-turn'>
          {showConfirmation
            ? <>
              <h3 className='confirmation-turn-text'>¡Turno reservado con éxito!</h3>
              <div className='confirmation-turn-buttons'>
                <Link className='confirmation-turn-btn-secondary' onClick={handleCloseConfirmationTurn}>Seguir explorando</Link>
                <Link className='confirmation-turn-btn-primary' to={'/account/my-turns'}>Ver mis turnos</Link>
              </div>
              </>
            : <>
              <div className="modal-turn-head">
                <h2>Turno seleccionado</h2>
                <CloseIcon onClick={handleToggleModalTurn} className='modal-turn-close-btn' sx={{ fontSize: 30 }} />
              </div>
              <div className="modal-turn-body">
                <ul className="modal-turn-info">
                  <li><span>Fecha:</span> {info.turn.date}</li>
                  <li><span>Hora:</span> {info.turn.time} hs</li>
                  <li><span>Servicio:</span> {info.service.name}</li>
                  <li><span>Duración:</span> {turnDuration(info.service.duration)}</li>
                  <li><span>Valor:</span> ${info.service.price}</li>
                </ul>
                <button className="modal-turn-primary-btn" onClick={() => handleRequestTurn()}>Reservar</button>
              </div>
              </>
          }
        </div>
    </div>
  )
}
