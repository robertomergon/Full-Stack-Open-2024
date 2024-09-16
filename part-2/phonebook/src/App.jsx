import { useState } from 'react'
import List from './components/List'
import Form from './components/Form'
import Filter from './components/Filter'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [personsFiltered, setPersonsFiltered] = useState(persons)

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

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