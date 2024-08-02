import { useTurnStore } from '../store/turn'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import './MyAccount.css'
import { useEffect } from 'react'
import { PastTurns } from '../components/PastTurns.jsx'
import { FutureTurns } from '../components/FutureTurns.jsx'

export const MyTurnsPage = () => {
  const fetchUserTurns = useTurnStore(state => state.fetchUserTurns)
  const userTurns = useTurnStore(state => state.userTurns)

  useEffect(() => {
    fetchUserTurns()
  }, [fetchUserTurns])

  return (
    <div className="myturns">
      {userTurns.length > 0
        ? <>
          <PastTurns />
          <FutureTurns />
          </>
        : <div className='nouserturns'>
            <ErrorOutlineIcon sx={{ fontSize: 80, color: '#3ea5ce' }} />
            <p>Todavía no has solicitado turnos, cuando lo hagas apareceran aquí</p>
          </div>
      }
    </div>
  )
}
