import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { Box, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import dayjs from 'dayjs'
import { translateDay } from '../utils/turnUtils'

export const TimeSlotInput = ({ day, checked, timeSlots, onCheck, onAddSlot, onRemoveSlot, onChangeTime, onCopySlots }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <FormControlLabel
        sx={{ display: 'flex', flexDirection: 'column', margin: 0 }}
        control={<Checkbox onChange={onCheck} />}
        label={translateDay(day)}
      />
      {timeSlots.map((slot, index) => (
        <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TimePicker
            sx={{ width: '8rem' }}
            label='Desde'
            ampm={false}
            disabled={!checked}
            value={checked ? (slot.start ? dayjs(slot.start, 'HH:mm') : null) : null}
            onChange={(value) => onChangeTime(index, 'start', value)}
          />
          <TimePicker
            sx={{ width: '8rem' }}
            label='Hasta'
            ampm={false}
            disabled={!checked}
            value={checked ? (slot.end ? dayjs(slot.end, 'HH:mm') : null) : null}
            onChange={(value) => onChangeTime(index, 'end', value)}
          />
          {timeSlots.length === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <IconButton disabled={!checked || (!timeSlots[index].start || !timeSlots[index].end)} onClick={onAddSlot} sx={{ color: '#3EA5CE' }} disableRipple>
                <AddIcon />
              </IconButton>
              <IconButton disabled={!checked || (!timeSlots[index].start || !timeSlots[index].end)} onClick={onCopySlots} sx={{ background: '#3EA5CE', borderRadius: '.2rem', color: '#FFFFFF', fontSize: '1rem' }} disableRipple>
                <p>Copiar</p>
              </IconButton>
            </div>
          )}
          {index > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <IconButton disabled={!checked} onClick={onRemoveSlot} sx={{ color: '#DC3545' }} disableRipple>
                <RemoveIcon />
              </IconButton>
              <IconButton disabled={!checked || (!timeSlots[index].start || !timeSlots[index].end)} onClick={onCopySlots} sx={{ background: '#3EA5CE', borderRadius: '.2rem', color: '#FFFFFF', fontSize: '1rem' }} disableRipple>
                <p>Copiar</p>
              </IconButton>
            </div>
          )}
        </Box>
      ))}
    </Box>
  )
}
