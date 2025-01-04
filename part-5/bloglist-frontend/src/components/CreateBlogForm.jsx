import React, { useState } from 'react'
import MessageBox from './MessageBox'

const CreateBlogForm = ({ createBlog, setRefetch }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const [message, setMessage] = useState(null)

    const handleCreateBlog = async (event) => {
        event.preventDefault()
        try {
            await createBlog({ title, author, url })
            setMessage({ type: 'success', text: `A new blog ${title} by ${author} added` })
            setRefetch(true)
            setTitle('')
            setAuthor('')
            setUrl('')
        } catch (error) {
            setMessage({ type: 'error', text: "Wrong username or password" })
        }
    }

    return (
        <div>
            <h2>Create new</h2>
            <MessageBox message={message} />
            <form onSubmit={handleCreateBlog}>
                <div>
                    Title:
                    <input
                        type="text"
                        value={title}
                        name="Title"
                        onChange={({ target }) => setTitle(target.value)}
                    />
                </div>
                <div>
                    Author:
                    <input
                        type="text"
                        value={author}
                        name="Author"
                        onChange={({ target }) => setAuthor(target.value)}
                    />
                </div>
                <div>
                    Url:
                    <input
                        type="text"
                        value={url}
                        name="Url"
                        onChange={({ target }) => setUrl(target.value)}
                    />
                </div>
                <button type="submit">Create</button>
            </form>
        </div>
    )
}

export default CreateBlogForm