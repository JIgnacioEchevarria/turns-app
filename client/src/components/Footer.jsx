import MailOutlineIcon from '@mui/icons-material/MailOutline'
import InstagramIcon from '@mui/icons-material/Instagram'
import GitHubIcon from '@mui/icons-material/GitHub'

export const Footer = () => {
  return (
    <footer className="footer">
      <h4>JIE Turnos</h4>
      <ul className='contact-list'>
        <li><a href=""><MailOutlineIcon sx={{ fontSize: '2rem', color: '#FFFFFF', cursor: 'pointer' }} /></a></li>
        <li><a href="https://www.instagram.com/nachoechevarria3/"><InstagramIcon sx={{ fontSize: '2rem', color: '#FFFFFF', cursor: 'pointer' }} /></a></li>
        <li><a href="https://github.com/JIgnacioEchevarria"><GitHubIcon sx={{ fontSize: '2rem', color: '#FFFFFF', cursor: 'pointer' }} /></a></li>
      </ul>
    </footer>
  )
}
