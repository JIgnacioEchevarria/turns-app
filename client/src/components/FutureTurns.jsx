import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import { useTurnStore } from '../store/turn'
import { useUserStore } from '../store/user'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { turnDuration } from '../utils/turnUtils'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export const FutureTurns = () => {
  const [showConfirmationCancel, setShowConfirmationCancel] = useState(false)
  const userTurns = useTurnStore(state => state.userTurns)
  const cancelTurn = useTurnStore(state => state.cancelTurn)
  const logout = useUserStore(state => state.logout)
  const isLoading = useTurnStore(state => state.isLoading)
  const navigate = useNavigate()
  const fetchUserTurns = useTurnStore(state => state.fetchUserTurns)
  const futureTurns = userTurns.filter(turn => new Date(turn.date_time) > new Date())

  const handleCancelTurn = async (id) => {
    const res = await cancelTurn(id)
    if (res === 'Success') {
      setShowConfirmationCancel(true)
    } else if (res === 'Access Not Authorized') {
      const success = await logout()
      if (success) navigate('/login', { state: { accessDeniedMessage: 'Acceso denegado' } })
    }
  }

  const handleCloseConfirmationCancel = async () => {
    setShowConfirmationCancel(false)
    await fetchUserTurns()
  }

  return (
    <div>
        {!isLoading && showConfirmationCancel &&
          <div className='cancelturn-backdrop-modal'>
            <div className='cancelturn-modal'>
              <h3>Turno cancelado con éxito</h3>
              <div className='cancelturn-modal-actions'>
                <button onClick={handleCloseConfirmationCancel}>Entendido</button>
              </div>
            </div>
          </div>
        }
        <Accordion defaultExpanded={false}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1-content'
              id='panel1-header'
              sx={{ fontWeight: 600 }}
            >
                Turnos Futuros
            </AccordionSummary>
            <AccordionDetails>
                {futureTurns.map((turn) => (
                    <div key={turn.id_turn} className="myturns-card">
                        <div className="myturns-card-header">
                            <p>{turn.date}</p>
                            <p>{turn.time} hs</p>
                        </div>
                        <div className="myturns-card-body">
                            <p><span className="myturns-card-label">Nombre de usuario:</span> {turn.username}</p>
                            <p><span className="myturns-card-label">Servicio:</span> {turn.service}</p>
                            <p><span className="myturns-card-label">Precio:</span> ${turn.price}</p>
                            <p><span className="myturns-card-label">Duración:</span> {turnDuration(turn.duration)}</p>
                        </div>
                        <div className='myturns-card-bottom'>
                            <button onClick={() => handleCancelTurn(turn.id_turn)} className='myturns-card-cancel'>Cancelar</button>
                        </div>
                    </div>
                ))}
            </AccordionDetails>
        </Accordion>
    </div>
  )
}
