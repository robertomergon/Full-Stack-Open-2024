import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import authService from './services/auth'
import CreateBlogForm from './components/CreateBlogForm'
import MessageBox from './components/MessageBox'
import Togglable from './components/Toggable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [loginMessage, setLoginMessage] = useState(null)
  const [refetch, setRefetch] = useState(true)

  const createBlogRef = useRef()

  useEffect(() => {
    if (refetch === true) {
      blogService.getAll().then(blogs => {
        setBlogs(blogs.sort((a, b) => b.likes - a.likes))
        setRefetch(false)
      })
    }
  }, [refetch])

  useEffect(() => {
    setTimeout(() => {
      setLoginMessage(null)
    }, 5000)
  }, [loginMessage])

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
        setLoginMessage({ type: 'error', text: 'Wrong username or password, please try again' })
      })
  }

  function handleLike() {
    blogServices.like(blog.id, { ...blog, likes: blog.likes + 1 }).then(() => {
      setRefetch(true)
    })
  }

  return (
    user === null ?
      <div>
        <h2>log in to application</h2>
        <MessageBox message={loginMessage} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input placeholder='username' type='text' value={username} onChange={({ target }) => setUsername(target.value)} />
          </div>
          <div>
            password
            <input placeholder='password' type='password' value={password} onChange={({ target }) => setPassword(target.value)} />
          </div>
          <button type="submit">login</button>
        </form>
      </div> :
      <div>
        <h2>blogs</h2>
        <Togglable buttonLabel='create new blog' ref={createBlogRef}>
          <CreateBlogForm createBlog={blogService.create} setRefetch={setRefetch} />
        </Togglable>
        <p>
          Logged in as {user.name} <b>@{user.username}</b> <button onClick={() => {
            setUser(null)
            localStorage.removeItem('user')
          }}>logout</button>
        </p>
        <ol>
          {blogs.map(blog =>
            <li key={blog.id}>
              <Blog key={blog.id} blog={blog} setRefetch={setRefetch} handleLike={handleLike} />
            </li>
          )}
        </ol>
      </div>
  )
}

export default App