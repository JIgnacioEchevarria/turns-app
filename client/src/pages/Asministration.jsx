import ServicesTable from '../components/ServicesTable'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { useServiceStore } from '../store/service'
import CircularProgress from '@mui/material/CircularProgress'
import './Administration.css'
import { ModalService } from '../components/ModalService'
import { useState, useEffect, useCallback } from 'react'
import { PopupAlert } from '../components/PopUps'
import { serviceErrorMessages, turnErrorMessages, userErrorMessages } from '../constants/messages'
import { UsersTable } from '../components/UsersTable'
import { useUserStore } from '../store/user'
import { useTurnStore } from '../store/turn'
import { TurnCard } from '../components/TurnCard'
import { TimeSlotInput } from '../components/TimeSlotInput.jsx'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { useLocation, useNavigate } from 'react-router-dom'
import { Calendar } from 'react-date-range'

export const TurnsPage = () => {
  const [selectedDate, setSelectedDate] = useState()

  const isLoading = useTurnStore(state => state.isLoading)
  const registeredTurns = useTurnStore(state => state.registeredTurns)
  const fetchRegisteredTurns = useTurnStore(state => state.fetchRegisteredTurns)
  const logout = useUserStore(state => state.logout)
  const navigate = useNavigate()

  const handleSelectDate = async (date) => {
    const formattedDate = date.toISOString().slice(0, 10)
    setSelectedDate(date)
    const status = await fetchRegisteredTurns(formattedDate)
    if (status === 403) {
      const success = await logout()
      if (success) navigate('/login', { state: { accessDeniedMessage: 'Acceso denegado' } })
    }
  }

  return (
    <div className="turns-page">
      {isLoading &&
        <div className='loading'>
          <CircularProgress size={80} className='loading-circle' />
        </div>
      }
      <div className='turns-page-head'>
        <h1>Turnos agendados</h1>
      </div>
      <div className='turns-page-body'>
        <Calendar
          className='calendar-admin'
          date={selectedDate}
          onChange={handleSelectDate}
        />
        <div className='turns-list'>
          {!isLoading && registeredTurns.length > 0 && selectedDate &&
            <>
              <div className='turn-list-head'>
                <p>{registeredTurns.length} Resultados</p>
              </div>
              {registeredTurns.map((turn) => (
                <TurnCard key={turn.id_turn} info={turn} />
              ))}
            </>
          }
          {!isLoading && selectedDate && registeredTurns.length === 0 && <h2 className='no-registered-turns'>No tienes turnos agendados para este día</h2>}
          {!selectedDate && registeredTurns.length === 0 && <h2 className='no-registered-turns'>Selecciona una fecha para ver los turnos agendados</h2>}
        </div>
      </div>
    </div>
  )
}

export const ServicesPage = () => {
  const [isOpenModalService, setIsOpenModalService] = useState(false)
  const isLoading = useServiceStore(state => state.isLoading)
  const serviceError = useServiceStore(state => state.serviceError)
  const resetServiceErrors = useServiceStore(state => state.resetServiceErrors)

  const handleToggleModalTurn = () => {
    setIsOpenModalService(prevState => !prevState)
  }

  const handleClosePopUp = () => {
    resetServiceErrors()
  }

  return (
    <div className="services-page">
      {serviceError && serviceError.status !== 403 && serviceError.status !== 404 && serviceError.status !== 422 && <PopupAlert handleClosePopup={handleClosePopUp} errorMessage={serviceErrorMessages(serviceError.error)} />}
      {isOpenModalService && <ModalService handleToggleModalService={handleToggleModalTurn} />}
      {isLoading &&
        <div className='loading'>
          <CircularProgress size={80} className='loading-circle' />
        </div>
      }
      <div className='services-page-head'>
        <h1>Servicios</h1>
        <button onClick={handleToggleModalTurn} className='btn-add-service'><AddCircleIcon fontSize='small' />Añadir</button>
      </div>
      <ServicesTable />
    </div>
  )
}

export const UsersPage = () => {
  const isLoading = useUserStore(state => state.isLoading)
  const userError = useUserStore(state => state.userError)
  const resetUserErrors = useUserStore(state => state.resetUserErrors)

  const handleClosePopUp = () => {
    resetUserErrors()
  }

  return (
    <div className="users-page">
      {userError && userError.status !== 403 && <PopupAlert handleClosePopup={handleClosePopUp} errorMessage={userErrorMessages(userError.error)} />}
      {isLoading &&
        <div className='loading'>
          <CircularProgress size={80} className='loading-circle' />
        </div>
      }
      <div className='users-page-head'>
        <h1>Usuarios</h1>
      </div>
      <UsersTable />
    </div>
  )
}

export const SettingsPage = () => {
  const [showSuccessGenerate, setShowSuccessGenerate] = useState(false)
  const configureCalendar = useTurnStore(state => state.configureCalendar)
  const isLoading = useTurnStore(state => state.isLoading)
  const turnError = useTurnStore(state => state.turnError)
  const resetTurnErrors = useTurnStore(state => state.resetTurnErrors)
  const logout = useUserStore(state => state.logout)
  const navigate = useNavigate()
  const location = useLocation()

  const [daysOfWeek, setDaysOfWeek] = useState([
    { dayIndex: 1, day: 'Lunes', checked: false, timeSlots: [{ start: null, end: null }] },
    { dayIndex: 2, day: 'Martes', checked: false, timeSlots: [{ start: null, end: null }] },
    { dayIndex: 3, day: 'Miércoles', checked: false, timeSlots: [{ start: null, end: null }] },
    { dayIndex: 4, day: 'Jueves', checked: false, timeSlots: [{ start: null, end: null }] },
    { dayIndex: 5, day: 'Viernes', checked: false, timeSlots: [{ start: null, end: null }] },
    { dayIndex: 6, day: 'Sábado', checked: false, timeSlots: [{ start: null, end: null }] },
    { dayIndex: 0, day: 'Domingo', checked: false, timeSlots: [{ start: null, end: null }] }
  ])

  useEffect(() => {
    resetTurnErrors()
  }, [location.pathname])

  const handleCheckChange = useCallback((index) => {
    const newDaysOfWeek = [...daysOfWeek]
    if (newDaysOfWeek[index].checked) {
      newDaysOfWeek[index].timeSlots = [{ start: null, end: null }]
    }
    newDaysOfWeek[index].checked = !newDaysOfWeek[index].checked
    setDaysOfWeek(newDaysOfWeek)
  }, [daysOfWeek])

  const handleAddSlot = useCallback((index) => {
    const newDaysOfWeek = [...daysOfWeek]
    if (newDaysOfWeek[index].timeSlots.length < 2) {
      newDaysOfWeek[index].timeSlots.push({ start: null, end: null })
      setDaysOfWeek(newDaysOfWeek)
    }
  }, [daysOfWeek])

  const handleRemoveSlot = useCallback((index) => {
    const newDaysOfWeek = [...daysOfWeek]
    newDaysOfWeek[index].timeSlots.pop()
    setDaysOfWeek(newDaysOfWeek)
  }, [daysOfWeek])

  const handleChangeTime = useCallback((dayIndex, slotIndex, key, value) => {
    const newDaysOfWeek = [...daysOfWeek]
    if (newDaysOfWeek[dayIndex] && newDaysOfWeek[dayIndex].timeSlots[slotIndex]) {
      newDaysOfWeek[dayIndex].timeSlots[slotIndex][key] = value.format('HH:mm')
      setDaysOfWeek(newDaysOfWeek)
    }
  }, [daysOfWeek])

  const validateTimeSlots = useCallback((days, interval, deadline) => {
    for (const day of days) {
      if (day.checked) {
        const validSlots = day.timeSlots.every(slot => slot.start !== null && slot.end !== null)
        if (!validSlots) {
          return false
        }
      }
    }

    if (!interval || !deadline) return false

    return true
  }, [daysOfWeek])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const interval = parseFloat(formData.get('interval-turns'))
    const deadline = formData.get('deadline-calendar')

    if (validateTimeSlots(daysOfWeek, interval, deadline)) {
      const status = await configureCalendar({ attentionSchedule: daysOfWeek, interval, deadline })
      if (status === 200) {
        setShowSuccessGenerate(true)
      } else if (status === 403) {
        const success = await logout()
        if (success) navigate('/login', { state: { accessDeniedMessage: 'Acceso denegado' } })
      }
    }
  }

  const handleCloseSuccessGenerate = () => {
    setShowSuccessGenerate(false)
    navigate('/')
  }

  const handleClosePopUp = () => {
    resetTurnErrors()
  }

  const handleCopySlots = useCallback((index) => {
    const newDaysOfWeek = [...daysOfWeek]
    const slotsToCopy = daysOfWeek[index].timeSlots
    newDaysOfWeek.forEach((day, i) => {
      if (day.checked && i !== index) {
        newDaysOfWeek[i].timeSlots = slotsToCopy.map(slot => ({ ...slot }))
      }
    })

    setDaysOfWeek(newDaysOfWeek)
  }, [daysOfWeek])

  return (
    <div className='settings-page'>
      {!isLoading && showSuccessGenerate &&
        <div className='success-backdrop-modal'>
          <div className='success-modal'>
            <h3>Calendario configurado con éxito</h3>
            <p>Los turnos ya son visibles en el calendario para todos tus clientes</p>
            <div className='success-modal-actions'>
              <button onClick={handleCloseSuccessGenerate}>Entendido</button>
            </div>
          </div>
        </div>
      }
      {isLoading &&
        <div className='loading'>
          <CircularProgress size={80} className='loading-circle' />
        </div>
      }
      {turnError && turnError.status !== 403 &&
        <PopupAlert handleClosePopup={handleClosePopUp} errorMessage={turnErrorMessages(turnError.error)} />
      }
      <div className='settings-page-head'>
        <h1>Configuración del calendario</h1>
      </div>
      <form className='form-attention-schedule' onSubmit={(e) => handleSubmit(e)}>
        <div className='form-attention-schedule-item'>
          <label className='input-label'>Horarios de atención</label>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {daysOfWeek.map((day, index) => (
              <TimeSlotInput
                key={day.dayIndex}
                day={day.day}
                checked={day.checked}
                timeSlots={day.timeSlots}
                onCheck={() => handleCheckChange(index)}
                onAddSlot={() => handleAddSlot(index)}
                onRemoveSlot={() => handleRemoveSlot(index)}
                onChangeTime={(slotIndex, key, value) => handleChangeTime(index, slotIndex, key, value)}
                onCopySlots={() => handleCopySlots(index)}
              />
            ))}
          </div>
        </div>
        <div className='form-attention-schedule-item'>
          <label className='input-label' htmlFor="interval-turns">Intervalo de tiempo entre cada turno</label>
          <input required placeholder='En minutos' type="number" name="interval-turns" id="interval-turns" />
        </div>
        <div className='form-attention-schedule-item'>
          <label className='input-label'>Configuración válida hasta</label>
          <DatePicker
            name='deadline-calendar'
            format='YYYY-MM-DD'
            minDate={dayjs().add(1, 'day')}
          />
        </div>
        <div className='form-attention-schedule-bottom'>
          <button className='form-attention-schedule-btnsave' type="submit">Guardar</button>
        </div>
      </form>
    </div>
  )
}
