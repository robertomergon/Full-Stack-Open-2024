import Togglable from './Toggable'

import { useRef } from 'react'
import blogServices from '../services/blogs'

const Blog = ({ blog, setRefetch, handleLike }) => {
  const blogRef = useRef()
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div className='blog' style={blogStyle}>
      {blog.title} {blog.author}
      <Togglable buttonLabel='view' cancelLabel='hide' ref={blogRef}>
        <div>
          {blog.url}
          <br />
          <p className='likeText'>{blog.likes} likes</p> <button className='likeButton' onClick={handleLike}>like</button>
          <br />
          added by {blog.user.name}
          <br />
          {
          blog.user.username === JSON.parse(localStorage.getItem('user')).username &&
          <button onClick={() => {
            if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
              blogServices.deleteBlog(blog.id).then(() => {
                setRefetch(true)
              })
            }
          }}>remove</button>
        }
        </div>
      </Togglable>
    </div>
  )
}

export default Blog