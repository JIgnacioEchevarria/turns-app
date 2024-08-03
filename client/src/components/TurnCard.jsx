import { turnDuration } from '../utils/turnUtils'

export const TurnCard = ({ info }) => {
  return (
    <div className='turn-card'>
        <div className='turn-card-group'>
            <div className='turn-card-group-head'>
                <h3>Información del turno</h3>
            </div>
            <div className='turn-card-group-body'>
                <p><span className='turn-card-label'>Día:</span> {info.date}</p>
                <p><span className='turn-card-label'>Horario:</span> {info.time}</p>
                <p><span className='turn-card-label'>Servicio:</span> {info.service}</p>
                <p><span className='turn-card-label'>Duración:</span> {turnDuration(info.duration)}</p>
                <p><span className='turn-card-label'>Precio:</span> ${info.price}</p>
            </div>
        </div>
        <div className='turn-card-group'>
            <div className='turn-card-group-head'>
                <h3>Información del cliente</h3>
            </div>
            <div className='turn-card-group-body'>
                <p><span className='turn-card-label'>Nombre:</span> {info.username}</p>
                <p><span className='turn-card-label'>Email:</span> {info.useremail}</p>
                <p><span className='turn-card-label'>Teléfono:</span> {info.phone_number}</p>
            </div>
        </div>
    </div>
  )
}
