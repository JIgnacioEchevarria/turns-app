import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { useEffect, useState } from 'react'
import { useServiceStore } from '../store/service.js'

export const ServiceSelect = ({ handleChangeService }) => {
  const [service, setService] = useState('')
  const services = useServiceStore(state => state.services)
  const fetchServices = useServiceStore(state => state.fetchServices)

  const handleChange = (event) => {
    setService(event.target.value)
    handleChangeService(event.target.value)
  }

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="service-select">Servicio</InputLabel>
        <Select
          labelId="service-select"
          id="service-select"
          value={service}
          label='Servicio'
          onChange={handleChange}
        >
            {services && services.length > 0
              ? services.map(s => (
                  <MenuItem key={s.id} style={{ display: 'flex', justifyContent: 'space-between' }} value={s.id}>
                      <span className='select-service-name'>{s.name}</span>
                      <span className='select-service-price'>${s.price}</span>
                  </MenuItem>
              ))
              : (
                  <MenuItem style={{ display: 'flex', justifyContent: 'space-between' }} value='no_turns' disabled>
                    <span className='select-service-name'>Por el momento no hay servicios disponibles</span>
                  </MenuItem>
                )
            }
        </Select>
      </FormControl>
    </Box>
  )
}
