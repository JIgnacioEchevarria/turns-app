import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

export const PopupAlert = ({ handleClosePopup, errorMessage }) => {
  const handleClickInside = (e) => {
    // Funcion para que cuando popup el modal no se cierre.
    e.stopPropagation()
  }

  return (
    <div onClick={handleClosePopup} className='container-popup'>
        <div onClick={handleClickInside} className='popup'>
            <ErrorOutlineIcon sx={{ fontSize: 80, color: '#3ea5ce' }} />
            <h2>Ups!!!</h2>
            <p>{errorMessage}</p>
            <button onClick={handleClosePopup}>Entendido</button>
        </div>
    </div>
  )
}
