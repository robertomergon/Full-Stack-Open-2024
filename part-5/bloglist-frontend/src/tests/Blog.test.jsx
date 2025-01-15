import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../components/Blog'

test('renders content', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'https://test.url',
    likes: 0,
    user: {
      name: 'Test User'
    }
  }
  const user = userEvent.setup()
  const { container } = render(<Blog blog={blog} />)
  
  // const element = screen.getByText(`${blog.title} ${blog.author}`)
  // expect(element).toBeDefined()

  // screen.debug(element)

  // This is the same as the above but using querySelector 
  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent(`${blog.title} ${blog.author}`)
})

test('at first only title and author are displayed, not the number of likes or url', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'https://test.url',
    likes: 0,
    user: {
      name: 'Test User'
    }}
    
  const container = render(<Blog blog={blog} />)


  const div = container.container.querySelector('.togglableContent')

  expect(div).toHaveTextContent(`${blog.url}`).not.toBeVisible()
  expect(div).toHaveTextContent(`${blog.likes} likes`).not.toBeVisible()
  expect(div).toHaveTextContent(`added by ${blog.user.name}`).not.toBeVisible()

})