import { Link } from "react-router-dom"

const Error = () => {
  return (
    <section className="section-content">
      <h2>404</h2>
      <p>Page not found</p>
      <p>
        <Link to="/">Home</Link>
      </p>
    </section>
  )
}

export default Error
