import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import authService from './services/auth'
import CreateBlogForm from './components/CreateBlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [refetch, setRefetch] = useState(true)

  useEffect(() => {
    if (refetch === true) {
      blogService.getAll().then(blogs => {
        setBlogs(blogs)
        setRefetch(false)
      })
    }
  }, [refetch])

  const handleLogin = async (event) => {
    event.preventDefault()
    authService.login({ username, password })
      .then(user => {
        setUser(user)
        localStorage.setItem('user', JSON.stringify(user))
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
        <CreateBlogForm createBlog={blogService.create} setRefetch={setRefetch} />
        <p>
          Logged in as {user.name} <b>@{user.username}</b> <button onClick={() => {
            setUser(null)
            localStorage.removeItem('user')
          }}>logout</button>
        </p>
        <ul>
          {blogs.map(blog =>
            <li key={blog.id}>
              <Blog key={blog.id} blog={blog} />
            </li>
          )}
        </ul>
      </div>
  )
}

export default App