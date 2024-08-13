import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { Calendar } from 'react-date-range'
import './Home.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import { ServiceSelect } from '../components/ServiceSelect.jsx'
import { useTurnStore } from '../store/turn.js'
import { PopupAlert } from '../components/PopUps.jsx'
import { ModalTurn } from '../components/ModalTurn.jsx'
import { useServiceStore } from '../store/service.js'
import { turnErrorMessages } from '../constants/messages.js'
import { useUserStore } from '../store/user.js'

export const HomePage = () => {
  const [selectedOptions, setSelectedOptions] = useState({ turn: null, service: null })
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isOpenModalTurn, setIsOpenModalTurn] = useState(false)

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

  const handleSelectTurn = (turn) => {
    setSelectedOptions({ ...selectedOptions, turn })
  }

  const handleClosePopUp = () => {
    resetTurnErrors()
  }

  const handleToggleModalTurn = () => {
    if (!userInfo) navigate('/login')
    setIsOpenModalTurn(prevState => !prevState)
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
        <div className='available-turns-list'>
          {!isLoading && availableTurns && availableTurns.map(t => (
            <div onClick={() => handleSelectTurn(t.id_turn)} className={selectedOptions.turn === t.id_turn ? 'turntime-card turntime-card-selected' : 'turntime-card'} key={t.id_turn}>
              <p>{t.time} hs</p>
            </div>
          ))}
        </div>
        {selectedOptions && selectedOptions.service && selectedOptions.turn &&
          <button onClick={handleToggleModalTurn} className='req-turn-btn'>Reservar turno</button>
        }
        {isOpenModalTurn &&
          <ModalTurn
            handleToggleModalTurn={handleToggleModalTurn}
            info={{
              service: (services.find((s) => s.id === selectedOptions.service)),
              turn: (availableTurns.find((t) => t.id_turn === selectedOptions.turn))
            }}
          />
        }
    </div>
  )
}
