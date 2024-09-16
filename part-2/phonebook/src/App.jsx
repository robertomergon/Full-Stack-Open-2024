import { useState, useEffect } from 'react'
import List from './components/List'
import Form from './components/Form'
import Filter from './components/Filter'
import { getAll } from './services/person.services'

const App = () => {
  const [persons, setPersons] = useState([])
  const [personsFiltered, setPersonsFiltered] = useState(persons)

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  // When the component is first rendered, the effect hook retrieves the initial list of persons from the server
  useEffect(() => {
    getAll()
      .then(response => {
        setPersons(response.data)
        setPersonsFiltered(response.data)
      })
  }
    , [])


  const handleSubmit = (e) => {
    e.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    if (persons.find(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      setNewName('')
      return
    }
    if (persons.find(person => person.number === newNumber)) {
      alert(`${newNumber} is already added to phonebook`)
      setNewNumber('')
      return
    }
    setPersons(
      [
        ...persons,
        personObject
      ]
    )
    setPersonsFiltered(
      [
        ...personsFiltered,
        personObject
      ]
    )
    setNewName('')
    setNewNumber('')
  }

  const handleFilter = (e) => {
    const filter = e.target.value
    setNewFilter(filter)
    const filtered = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    setPersonsFiltered(filtered)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <h3>Search by name</h3>
      <Filter filter={newFilter} onFilter={handleFilter} />
      <h3>Add a new contact</h3>
      <Form handleSubmit={handleSubmit} newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber} />
      <div>
      </div>
      <h2>Numbers</h2>
      <List contacts={personsFiltered} />
    </div>
  )
}

export default App