import { useState, useEffect } from 'react'
import List from './components/List'
import Form from './components/Form'
import Filter from './components/Filter'
import Notification from './components/Notification'
import { getAll, create, deleteContact, update } from './services/person.services'

const App = () => {
  const [persons, setPersons] = useState([])
  const [personsFiltered, setPersonsFiltered] = useState(persons)

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [message, setMessage] = useState(null)

  // When the component is first rendered, the effect hook retrieves the initial list of persons from the server
  useEffect(() => {
    getAll()
      .then(response => {
        setPersons(response.data.map(person => {
          return { ...person, id: person._id }
        }))
        setPersonsFiltered(response.data.map(person => {
          return { ...person, id: person._id }
        }))
      })
  }
    , [])


  const handleSubmit = (e) => {
    e.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
      id: new String(persons.length + 1)
    }
    if (persons.find(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(person => person.name === newName)
        const updatedPerson = { ...person, number: newNumber }
        update(person.id, updatedPerson)
          .then(response => {
            setPersons(persons.map(person => person.id !== updatedPerson.id ? person : response.data))
            setPersonsFiltered(persons.map(person => person.id !== updatedPerson.id ? person : response.data))
          })
        return
      }
      else return
    }
    create(personObject)
      .then(response => {
        setMessage({ text: `Added ${newName}`, type: 'success' })
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        setPersons(persons.concat(response.data))
        setPersonsFiltered(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
      }).catch(error => {
        setMessage({ text: error.response.data.error, type: 'error' })
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }

  const handleFilter = (e) => {
    const filter = e.target.value
    setNewFilter(filter)
    const filtered = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    setPersonsFiltered(filtered)
  }

  const handleDelete = (id) => {
    const person = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${person.name} ?`)) {
      deleteContact(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setPersonsFiltered(persons.filter(person => person.id !== id))
        }).catch(error => {
          console.error(error)
          setMessage({ text: `Information of ${person.name} has already been removed from the server`, type: 'error' })
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          setPersons(persons.filter(person => person.id !== id))
          setPersonsFiltered(persons.filter(person => person.id !== id))
        })
    }
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <h3>Search by name</h3>
      <Filter filter={newFilter} onFilter={handleFilter} />
      <h3>Add a new contact</h3>
      <Notification message={message} />
      <Form handleSubmit={handleSubmit} newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber} />
      <div>
      </div>
      <h2>Numbers</h2>
      <List contacts={personsFiltered} deleteContact={handleDelete} />
    </div>
  )
}

export default App