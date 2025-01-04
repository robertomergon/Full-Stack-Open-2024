import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const response = await axios.post(baseUrl, newObject, {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}`
    }
  })
  return response.data
}

export default { getAll, create }