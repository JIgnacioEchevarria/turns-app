import { NavigationMenu } from './NavigationMenu'
import { Link } from 'react-router-dom'

export const Header = () => {
  return (
    <header className="header">
        <Link to={'/'}><h1 className="header-logo">JIE Turnos</h1></Link>
        <NavigationMenu />
    </header>
  )
}
