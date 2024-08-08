import { formErrorMessages } from '../constants/messages.js'

export const FormErrorMessage = ({ message }) => {
  return (
    <p className="form-input-error">
        {formErrorMessages(message)}
    </p>
  )
}
