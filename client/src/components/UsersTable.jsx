import { useEffect } from 'react'
import { useUserStore } from '../store/user'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { roleToText } from '../utils/userUtils.js'
import Paper from '@mui/material/Paper'
import { useNavigate } from 'react-router-dom'
import { RoleSelect } from './RoleSelect.jsx'
import { ROLES } from '../constants/roles.js'

export const UsersTable = () => {
  const fetchUsers = useUserStore(state => state.fetchUsers)
  const users = useUserStore(state => state.users)
  const userInfo = useUserStore(state => state.userInfo)
  const logout = useUserStore(state => state.logout)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const status = await fetchUsers()
      if (status === 403) {
        const success = await logout()
        if (success) navigate('/login', { state: { accessDeniedMessage: 'Acceso denegado' } })
      }
    }

    fetchData()
  }, [fetchUsers])

  return (
    <>
    {users.length > 0
      ? <TableContainer component={Paper} style={{ width: '100%' }}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell width={'20%'} sx={{ fontWeight: 800, fontSize: '1rem' }}>ID</TableCell>
                        <TableCell width={'25%'} sx={{ fontWeight: 800, fontSize: '1rem' }}>Nombre</TableCell>
                        <TableCell width={'30%'} sx={{ fontWeight: 800, fontSize: '1rem' }}>Email</TableCell>
                        <TableCell width={'10%'} sx={{ fontWeight: 800, fontSize: '1rem' }}>Teléfono</TableCell>
                        <TableCell width={'15%'} sx={{ fontWeight: 800, fontSize: '1rem' }}>Rol</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell sx={{ fontSize: '1rem' }}>{user.id}</TableCell>
                            <TableCell sx={{ fontSize: '1rem' }} component="th" scope="row">{user.name}</TableCell>
                            <TableCell sx={{ fontSize: '1rem' }} component="th" scope="row">{user.email}</TableCell>
                            <TableCell sx={{ fontSize: '1rem' }} component="th" scope="row">{user.phone_number}</TableCell>
                            <TableCell sx={{ fontSize: '1rem' }} component="th" scope="row">
                              {userInfo.role === ROLES.ADMIN && userInfo.id !== user.id
                                ? <RoleSelect info={user} />
                                : <p>{roleToText(user.role)}</p>
                              }
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
      : <div className='no-users-alert'>
            <ErrorOutlineIcon sx={{ fontSize: 80, color: '#3ea5ce' }} />
            <h2>Todavía no ofreces ningún servicio, cuando añadas uno aparecera aquí</h2>
        </div>
    }
    </>
  )
}
