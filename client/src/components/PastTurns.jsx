import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import { useTurnStore } from '../store/turn'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { turnDuration } from '../utils/turnUtils'

export const PastTurns = () => {
  const userTurns = useTurnStore(state => state.userTurns)
  const pastTurns = userTurns.filter(turn => new Date(turn.date_time) <= new Date())

  return (
    <div>
        <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1-content'
              id='panel1-header'
              sx={{ fontWeight: 600 }}
            >
                Turnos Pasados
            </AccordionSummary>
            <AccordionDetails>
                {pastTurns.map((turn) => (
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
                    </div>
                ))}
            </AccordionDetails>
        </Accordion>
    </div>
  )
}
