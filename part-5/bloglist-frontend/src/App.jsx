import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import authService from './services/auth'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    authService.login({ username, password })
      .then(user => {
        setUser(user)
        setUsername('')
        setPassword('')
      }).catch(error => {
        console.error(error)
      })
  }

  return (
    user === null ?
      <div>
        <h2>log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input type='text' value={username} onChange={({ target }) => setUsername(target.value)} />
          </div>
          <div>
            password
            <input type='password' value={password} onChange={({ target }) => setPassword(target.value)} />
          </div>
          <button type="submit">login</button>
        </form>
      </div> :
      <div>
        <h2>blogs</h2>
        <p>
          Logged in as {user.name} <b>@{user.username}</b>
        </p>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
  )
}

export default App