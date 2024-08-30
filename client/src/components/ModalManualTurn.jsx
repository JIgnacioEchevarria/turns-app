import { useState } from 'react'
import { turnDuration } from '../utils/turnUtils'
import CloseIcon from '@mui/icons-material/Close'
import { useTurnStore } from '../store/turn'
import { useUserStore } from '../store/user'
import { Link, useNavigate } from 'react-router-dom'

export const ModalManualTurn = ({ handleToggleModalTurn, info }) => {
  const [showFormClientInfo, setShowFormClientInfo] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const requestTurnManually = useTurnStore(state => state.requestTurnManually)
  const logout = useUserStore(state => state.logout)
  const navigate = useNavigate()

  const handleClickInside = (e) => {
    // Funcion para que cuando clickee el modal no se cierre.
    e.stopPropagation()
  }

  const handleRequestTurn = async (e) => {
    e.preventDefault()
    handleToggleFormCLientInfo()

    const formData = new FormData(e.target)

    const name = formData.get('name')
    const email = formData.get('email')
    const phoneNum = formData.get('phone-number')

    const status = await requestTurnManually({
      turn: info.turn.id_turn,
      service: info.service.id,
      client: { name, email, phoneNum }
    })

    if (status === 200) {
      setShowConfirmation(true)
    } else if (status === 403) {
      const success = await logout()
      if (success) navigate('/login', { state: { accessDeniedMessage: 'Acceso denegado' } })
    }
  }

  const handleToggleFormCLientInfo = () => {
    setShowFormClientInfo(prevState => !prevState)
  }

  const handleCloseConfirmationTurn = () => {
    window.location.reload()
  }

  return (
    <div onClick={handleToggleModalTurn} className='backdrop-modal-turn'>
      {showConfirmation
        ? (
          <div className='modal-turn'>
            <h3 className='confirmation-turn-text'>¡Turno agendado con éxito!</h3>
            <div className='confirmation-turn-buttons'>
              <Link className='confirmation-turn-btn-secondary' onClick={handleCloseConfirmationTurn}>Seguir explorando</Link>
              <Link className='confirmation-turn-btn-primary' to={'/administration/turns'}>Ver turnos agendados</Link>
            </div>
          </div>
          )
        : (!showFormClientInfo
            ? (
              <div onClick={handleClickInside} className='modal-turn'>
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
                </div>
                <button className="modal-turn-primary-btn" onClick={handleToggleFormCLientInfo}>Avanzar</button>
              </div>
              )
            : (
              <div onClick={handleClickInside} className='modal-turn'>
                <div className='modal-turn-head'>
                  <h2>Información del cliente</h2>
                  <CloseIcon onClick={handleToggleModalTurn} className='modal-turn-close-btn' sx={{ fontSize: 30 }} />
                </div>
                <form onSubmit={handleRequestTurn} className='modal-turn-formclient'>
                  <div className='form-item'>
                    <label htmlFor="name">Nombre</label>
                    <input type="text" id='name' name='name' autoCapitalize='name' required />
                  </div>
                  <div className='form-item'>
                    <label htmlFor="email">Email</label>
                    <input type="email" id='email' name='email' autoCapitalize='email' required />
                  </div>
                  <div className="form-item">
                    <label htmlFor="phone-number">Número de teléfono</label>
                    <input id='phone-number' type="tel" name="phone-number" required />
                    <p className='input-help'>Ingresá la característica (sin el cero inicial) y luego el número (sin el 15 inicial)</p>
                  </div>
                  <input type='submit' className="modal-turn-primary-btn" value='Confirmar turno' />
                </form>
              </div>
              )
          )}
    </div>
  )
}
