import CloseIcon from '@mui/icons-material/Close'
import { IconButton } from '@mui/material'
import { useServiceStore } from '../store/service'
import { useUserStore } from '../store/user'
import { useNavigate } from 'react-router-dom'
import { FormErrorMessage } from './FormErrorMessage'

export const ModalService = ({ handleToggleModalService }) => {
  const fetchServices = useServiceStore(state => state.fetchServices)
  const addService = useServiceStore(state => state.addService)
  const serviceError = useServiceStore(state => state.serviceError)
  const logout = useUserStore(state => state.logout)
  const navigate = useNavigate()

  const handleClickInside = (e) => {
    // Funcion para que cuando popup el modal no se cierre.
    e.stopPropagation()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)

    const name = formData.get('name')
    const duration = parseInt(formData.get('duration'))
    const price = parseInt(formData.get('price'))

    const status = await addService({ name, duration, price })

    if (status === 201) {
      handleToggleModalService()
      await fetchServices()
    } else if (status === 403) {
      const success = await logout()
      if (success) navigate('/login', { state: { accessDeniedMessage: 'Acceso denegado' } })
    }
  }

  const durationError = serviceError && serviceError.statusMessage === 'Validation Error' && serviceError.error.find(e => e.field === 'duration')
  const priceError = serviceError && serviceError.statusMessage === 'Validation Error' && serviceError.error.find(e => e.field === 'price')

  return (
    <div onClick={handleToggleModalService} className="backdrop-modal-service">
        <div onClick={handleClickInside} className="modal-service">
            <div className='modal-service-header'>
                <h2>Añadir un servicio</h2>
                <IconButton onClick={handleToggleModalService}><CloseIcon sx={{ fontSize: '2rem', cursor: 'pointer' }} /></IconButton>
            </div>
            <div className='modal-service-body'>
                <form onSubmit={handleSubmit} className='modal-service-form'>
                    <div className='modal-service-formitem'>
                        <label htmlFor="service-name">Nombre</label>
                        <input type="text" id='service-name' name='name' required />
                    </div>
                    <div className='modal-service-formitem'>
                        <label htmlFor="service-duration">Duración</label>
                        <input type="number" id='service-duration' name='duration' placeholder='En minutos' required />
                        {durationError && <FormErrorMessage message={durationError.message} />}
                    </div>
                    <div className='modal-service-formitem'>
                        <label htmlFor="service-price">Precio</label>
                        <input type="number" id='service-price' name='price' required />
                        {priceError && <FormErrorMessage message={priceError.message} />}
                    </div>
                    <input type="submit" id='service-add-btn' className='modal-service-btn-add' value="Añadir" />
                </form>
            </div>
        </div>
    </div>
  )
}
