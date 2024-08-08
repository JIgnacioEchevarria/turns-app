import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { IconButton, TextField } from '@mui/material'
import { useServiceStore } from '../store/service'
import { turnDuration } from '../utils/turnUtils'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../store/user'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import CloseIcon from '@mui/icons-material/Close'
import DoneIcon from '@mui/icons-material/Done'
import { serviceErrorMessages } from '../constants/messages.js'

export default function ServicesTable () {
  const services = useServiceStore(state => state.services)
  const fetchServices = useServiceStore(state => state.fetchServices)
  const removeService = useServiceStore(state => state.removeService)
  const editService = useServiceStore(state => state.editService)
  const logout = useUserStore(state => state.logout)
  const navigate = useNavigate()
  const serviceError = useServiceStore(state => state.serviceError)

  const [editCell, setEditCell] = useState({ row: null })
  const [fieldsValues, setFieldsValues] = useState({ name: '', duration: '', price: '' })

  useEffect(() => {
    const fetchData = async () => {
      await fetchServices()
    }

    fetchData()
  }, [fetchServices])

  const handleEditCell = (rowIndex, service) => {
    if (rowIndex === null) {
      setEditCell({ row: null })
    } else {
      setEditCell({ row: rowIndex })
      setFieldsValues({ name: service.name, duration: service.duration, price: service.price })
    }
  }

  const handleChangeInput = (e, field) => {
    setFieldsValues({ ...fieldsValues, [field]: e.target.value })
  }

  const handleSaveChanges = async (serviceId, info) => {
    const updatedService = {
      ...info,
      duration: parseInt(info.duration),
      price: parseInt(info.price)
    }
    const status = await editService(serviceId, updatedService)

    if (status === 200) {
      await fetchServices()
      handleEditCell(null, info)
    } else if (status === 403) {
      const success = await logout()
      if (success) navigate('/login', { state: { accessDeniedMessage: 'Acceso denegado' } })
    }
  }

  const handleRemoveService = async (id) => {
    const status = await removeService(id)
    if (status === 200) {
      await fetchServices()
    } else if (status === 403) {
      const success = await logout()
      if (success) navigate('/login', { state: { accessDeniedMessage: 'Acceso denegado' } })
    }
  }

  const handleKeyPress = (e, serviceId) => {
    if (e.key === 'Enter') handleSaveChanges(serviceId, fieldsValues)
  }

  const durationError = serviceError && serviceError.statusMessage === 'Validation Error' && serviceError.error.find(e => e.field === 'duration')
  const priceError = serviceError && serviceError.statusMessage === 'Validation Error' && serviceError.error.find(e => e.field === 'price')

  return (
    <>
    {services.length > 0
      ? <TableContainer component={Paper} style={{ width: '100%' }}>
            <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                      <TableCell width={'20%'} sx={{ fontWeight: 800, fontSize: '1rem' }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 800, fontSize: '1rem' }}>Servicio</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 800, fontSize: '1rem' }}>Duración</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 800, fontSize: '1rem' }}>Precio</TableCell>
                      <TableCell width={'10%'}></TableCell>
                      <TableCell width={'10%'}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                    {services.map((service, rowIndex) => (
                        <TableRow
                            key={service.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell sx={{ fontSize: '1rem' }}>{service.id}</TableCell>
                          {editCell.row === rowIndex
                            ? <TableCell sx={{ fontSize: '1rem' }} component="th" scope="row">
                                <TextField
                                  value={fieldsValues.name}
                                  onChange={(e) => handleChangeInput(e, 'name')}
                                  onKeyDown={(e) => handleKeyPress(e, service.id)}
                                />
                              </TableCell>
                            : <TableCell sx={{ fontSize: '1rem' }} component="th" scope="row">{service.name}</TableCell>
                          }
                          {editCell.row === rowIndex
                            ? <TableCell sx={{ fontSize: '1rem' }} component="th" scope="row">
                                <TextField
                                  type='number'
                                  value={fieldsValues.duration}
                                  onChange={(e) => handleChangeInput(e, 'duration')}
                                  onKeyDown={(e) => handleKeyPress(e, service.id)}
                                  error={Boolean(durationError)}
                                  helperText={durationError && serviceErrorMessages(durationError.message)}
                                />
                              </TableCell>
                            : <TableCell sx={{ fontSize: '1rem' }} align="center">{turnDuration(service.duration)}</TableCell>
                          }
                          {editCell.row === rowIndex
                            ? <TableCell sx={{ fontSize: '1rem' }} component="th" scope="row">
                                <TextField
                                  type='number'
                                  value={fieldsValues.price}
                                  onChange={(e) => handleChangeInput(e, 'price')}
                                  onKeyDown={(e) => handleKeyPress(e, service.id)}
                                  error={Boolean(priceError)}
                                  helperText={priceError && serviceErrorMessages(priceError.message)}
                                />
                              </TableCell>
                            : <TableCell sx={{ fontSize: '1rem' }} align="center">${service.price}</TableCell>
                          }
                          <TableCell align="center">
                              {editCell.row === rowIndex
                                ? <IconButton onClick={() => handleEditCell(null, service)} >
                                    <CloseIcon sx={{ color: '#DC3545', cursor: 'pointer' }} />
                                  </IconButton>
                                : <IconButton onClick={() => handleRemoveService(service.id)} >
                                    <DeleteIcon sx={{ color: '#DC3545', cursor: 'pointer' }} />
                                  </IconButton>
                              }
                          </TableCell>
                          <TableCell align="center">
                              {editCell.row === rowIndex
                                ? <IconButton onClick={() => handleSaveChanges(service.id, fieldsValues)} >
                                    <DoneIcon sx={{ color: '#28A745', cursor: 'pointer' }} />
                                  </IconButton>
                                : <IconButton onClick={() => handleEditCell(rowIndex, service)}>
                                    <EditIcon sx={{ color: '#FFC107', cursor: 'pointer' }} />
                                  </IconButton>
                              }
                          </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
      : <div className='no-services-alert'>
            <ErrorOutlineIcon sx={{ fontSize: 80, color: '#3ea5ce' }} />
            <h2>Todavía no ofreces ningún servicio, cuando añadas uno aparecera aquí</h2>
        </div>
    }
    </>
  )
}
