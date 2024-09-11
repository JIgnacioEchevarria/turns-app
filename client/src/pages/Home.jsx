import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { Calendar } from 'react-date-range'
import './Home.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import { ServiceSelect } from '../components/ServiceSelect.jsx'
import { useTurnStore } from '../store/turn.js'
import { AnnularTurnPopUp, PopupAlert } from '../components/PopUps.jsx'
import { ModalTurn } from '../components/ModalTurn.jsx'
import { useServiceStore } from '../store/service.js'
import { turnErrorMessages } from '../constants/messages.js'
import { useUserStore } from '../store/user.js'
import { TurnTimeCard } from '../components/TurnTimeCard.jsx'
import { ROLES } from '../constants/roles.js'
import { ModalManualTurn } from '../components/ModalManualTurn.jsx'

export const HomePage = () => {
  const [selectedOptions, setSelectedOptions] = useState({ turn: null, service: null })
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isOpenModalTurn, setIsOpenModalTurn] = useState(false)
  const [isOpenModalManualTurn, setIsOpenModalManualTurn] = useState(false)
  const [annularTurnId, setAnnularTurnId] = useState(null)

  const isLoading = useTurnStore(state => state.isLoading)
  const turnError = useTurnStore(state => state.turnError)
  const resetTurnErrors = useTurnStore(state => state.resetTurnErrors)
  const services = useServiceStore(state => state.services)
  const fetchAvailableTurns = useTurnStore(state => state.fetchAvailableTurns)
  const availableTurns = useTurnStore(state => state.availableTurns)
  const clearAvailableTurns = useTurnStore(state => state.clearAvailableTurns)
  const userInfo = useUserStore(state => state.userInfo)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    resetTurnErrors()
    clearAvailableTurns()
  }, [location.pathname])

  const handleSelectDate = async (date) => {
    if (selectedOptions.turn) setSelectedOptions({ ...selectedOptions, turn: null })
    const formattedDate = date.toISOString().slice(0, 10)
    setSelectedDate(date)
    const status = await fetchAvailableTurns(formattedDate)
    if (status === 404) {
      setSelectedOptions({ ...selectedOptions, turn: null })
    }
  }

  const handleSelectService = (service) => {
    setSelectedOptions({ ...selectedOptions, service })
  }

  const handleClosePopUp = () => {
    resetTurnErrors()
  }

  const handleToggleModalTurn = () => {
    if (!userInfo) navigate('/login')
    setIsOpenModalTurn(prevState => !prevState)
  }

  const handleToggleModalManualTurn = () => {
    if (!userInfo) navigate('/login')
    setIsOpenModalManualTurn(prevState => !prevState)
  }

  const handleToggleAnnularTurnPopUp = (id) => {
    if (!annularTurnId) {
      // Si es nulo le guardo el id del turno a anular
      setAnnularTurnId(id)
    } else {
      // Si tiene el id del turno lo vuelvo nulo para cerrar el popup
      setAnnularTurnId(null)
    }
  }

  const minDateCalendar = new Date()
  minDateCalendar.setDate(minDateCalendar.getDate() + 1)

  return (
    <div className="homepage">
        <div className='home-sections'>
          <h2>Seleccione un servicio</h2>
          <ServiceSelect handleChangeService={handleSelectService} />
        </div>
        <div className='home-sections'>
          <h2>Seleccione fecha y hora</h2>
          <Calendar
            className='calendar'
            date={selectedDate}
            onChange={handleSelectDate}
            minDate={minDateCalendar}
          />
        </div>
        {isLoading &&
          <div className='loading'>
            <CircularProgress size={80} className='loading-circle' />
          </div>
        }
        {turnError &&
          <PopupAlert handleClosePopup={handleClosePopUp} errorMessage={turnErrorMessages(turnError.error)} />
        }
        {annularTurnId &&
          <AnnularTurnPopUp
            close={handleToggleAnnularTurnPopUp}
            idTurn={annularTurnId}
          />
        }
        <div className='available-turns-list'>
          {!isLoading && availableTurns && availableTurns.map(t => (
            <TurnTimeCard
              key={t.id_turn}
              turnInfo={t}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              togglePopUp={handleToggleAnnularTurnPopUp}
            />
          ))}
        </div>
        {!userInfo && selectedOptions.service && selectedOptions.turn &&
          <div className="req-turn-buttons">
            <button onClick={handleToggleModalTurn} className='req-turn-btn'>Reservar turno</button>
          </div>
        }
        {userInfo && selectedOptions.service && selectedOptions.turn && (
          userInfo.role === ROLES.ADMIN || userInfo.role === ROLES.EMPLOYEE
            ? (
                <div className='req-turn-buttons'>
                  <button onClick={handleToggleModalTurn} className='req-turn-btn'>Reservar turno</button>
                  <button onClick={handleToggleModalManualTurn} className='reqmanual-turn-btn'>Agendar a cliente</button>
                </div>
              )
            : (
                <div className="req-turn-buttons">
                  <button onClick={handleToggleModalTurn} className='req-turn-btn'>Reservar turno</button>
                </div>
              )
        )}
        {isOpenModalTurn &&
          <ModalTurn
            handleToggleModalTurn={handleToggleModalTurn}
            info={{
              service: (services.find((s) => s.id === selectedOptions.service)),
              turn: (availableTurns.find((t) => t.id_turn === selectedOptions.turn))
            }}
          />
        }
        {isOpenModalManualTurn &&
          <ModalManualTurn
            handleToggleModalTurn={handleToggleModalManualTurn}
            info={{
              service: (services.find((s) => s.id === selectedOptions.service)),
              turn: (availableTurns.find((t) => t.id_turn === selectedOptions.turn))
            }}
          />
        }
    </div>
  )
}
