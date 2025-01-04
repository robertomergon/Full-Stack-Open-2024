import Togglable from "./Toggable"
import { useRef } from 'react'

const Blog = ({ blog }) => {
  const blogRef = useRef()
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <Togglable buttonLabel='view' cancelLabel='hide' ref={blogRef}>
        <div>
          {blog.url}
          <br />
          {blog.likes} likes <button>like</button>
          <br />
          added by {blog.user.name}
        </div>
      </Togglable>
    </div>
  )
}

export default Blog