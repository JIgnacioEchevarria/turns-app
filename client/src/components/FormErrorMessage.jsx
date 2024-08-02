import { userFormErrorMessages } from '../constants/messages.js'

export const FormErrorMessage = ({ message }) => {
  return (
    <p className="form-input-error">
        {userFormErrorMessages(message)}
    </p>
  )
}
