import Togglable from './Toggable'

import { useRef } from 'react'
import blogServices from '../services/blogs'

const Blog = ({ blog, setRefetch }) => {
  const blogRef = useRef()
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  function handleLike() {
    blogServices.like(blog.id, { ...blog, likes: blog.likes + 1 }).then(() => {
      setRefetch(true)
    })
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <Togglable buttonLabel='view' cancelLabel='hide' ref={blogRef}>
        <div>
          {blog.url}
          <br />
          {blog.likes} likes <button onClick={handleLike}>like</button>
          <br />
          added by {blog.user.name}
          <br />
          <button onClick={() => {
            if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
              blogServices.deleteBlog(blog.id).then(() => {
                setRefetch(true)
              })
            }
          }}>remove</button>
        </div>
      </Togglable>
    </div>
  )
}

export default Blog