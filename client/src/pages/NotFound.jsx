import { Link } from 'react-router-dom'

export const NotFoundPage = () => {
  return (
    <div className="notfoundpage">
        <img src="https://siliconvalleygazette.com/posts/what-is-the-404-not-found-error.png" alt="404 not found" />
        <Link to={'/'}>Regresar al inicio</Link>
    </div>
  )
}
