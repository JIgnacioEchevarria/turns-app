import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import { useUserStore } from '../store/user'
import { ROLES } from '../constants/roles'
import { IconButton } from '@mui/material'

export const TurnTimeCard = ({ turnInfo, selectedOptions, setSelectedOptions, togglePopUp }) => {
  const userInfo = useUserStore(state => state.userInfo)

  const handleSelectTurn = (turn) => {
    setSelectedOptions({ ...selectedOptions, turn })
  }

  return (
    <div onClick={() => handleSelectTurn(turnInfo.id_turn)} className={selectedOptions.turn === turnInfo.id_turn ? 'turntime-card turntime-card-selected' : 'turntime-card'}>
        {userInfo && (userInfo.role === ROLES.ADMIN || userInfo.role === ROLES.EMPLOYEE) &&
            <IconButton onClick={() => togglePopUp(turnInfo.id_turn)} sx={{ padding: 0, position: 'absolute', right: '-.5rem', top: '-.5rem', '&:hover': { backgroundColor: 'transparent' } }} >
                <RemoveCircleIcon className='turntime-card-cancel' />
            </IconButton>
        }
        <p>{turnInfo.time} hs</p>
    </div>
  )
}
