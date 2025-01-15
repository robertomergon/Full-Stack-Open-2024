import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlogForm from '../components/CreateBlogForm'


describe('<CreateBlogForm />', () => {
    test('renders content', () => {
        const createBlog = vi.fn()
        render(<CreateBlogForm createBlog={createBlog} />)
        expect(screen.getByText('Create new')).toBeDefined()
    })

    test('The form calls the event handler it received as props with the right details when a new blog is created', async () => {
        const createBlog = vi.fn()
        const setRefetch = vi.fn()
        const user = userEvent.setup()
        
        render(<CreateBlogForm createBlog={createBlog} setRefetch={setRefetch} />)

        const title = screen.getByPlaceholderText('Title')
        const author = screen.getByPlaceholderText('Author')
        const url = screen.getByPlaceholderText('Url')
        const formSubmit = screen.getByText('Create')

        await user.type(title, 'Test Title')
        await user.type(author, 'Test Author')
        await user.type(url, 'Test Url')
        await user.click(formSubmit)

        expect(createBlog).toHaveBeenCalledTimes(1)
        expect(createBlog).toHaveBeenCalledWith({
            title: 'Test Title',
            author: 'Test Author',
            url: 'Test Url',
        })
    })

})