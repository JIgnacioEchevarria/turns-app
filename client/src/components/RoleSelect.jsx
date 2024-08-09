import { Box, FormControl, MenuItem, Select } from '@mui/material'
import { useState } from 'react'
import { useUserStore } from '../store/user'
import { useNavigate } from 'react-router-dom'
import { roleToText } from '../utils/userUtils'
import { ROLES } from '../constants/roles.js'

export const RoleSelect = ({ info }) => {
  const [userRole, setUserRole] = useState({ id: info.id, role: info.role })
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const fetchUsers = useUserStore(state => state.fetchUsers)
  const changeRole = useUserStore(state => state.changeRole)
  const logout = useUserStore(state => state.logout)
  const navigate = useNavigate()

  const handleChangeRole = async (event) => {
    const newRole = event.target.value
    setUserRole(prevState => ({ ...prevState, role: newRole }))
    const status = await changeRole({ id: userRole.id, role: newRole })
    if (status === 200) {
      setShowSuccessModal(true)
    } else if (status === 403) {
      const success = await logout()
      if (success) navigate('/login', { state: { accessDeniedMessage: 'Acceso denegado' } })
    }
  }

  const handleCloseSuccessModal = async () => {
    setShowSuccessModal(false)
    await fetchUsers()
  }

  return (
    <Box sx={{ minWidth: 120 }}>
      {showSuccessModal &&
        <div className='success-backdrop-modal'>
          <div className='success-modal'>
            <h3>El rol del usuario {info.name} se ha modificado a {roleToText(userRole.role)}</h3>
            <div className='success-modal-actions'>
              <button onClick={handleCloseSuccessModal}>Entendido</button>
            </div>
          </div>
        </div>
      }
      <FormControl fullWidth>
        <Select
          labelId="role-select"
          id="role-select"
          value={userRole.role}
          onChange={handleChangeRole}
        >
            <MenuItem value={ROLES.CLIENT}>{roleToText(ROLES.CLIENT)}</MenuItem>
            <MenuItem value={ROLES.EMPLOYEE}>{roleToText(ROLES.EMPLOYEE)}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}
