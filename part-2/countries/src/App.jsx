import { useEffect, useState } from "react"
import { getAll, getSearch } from "./services/countries.services"
import List from "./components/List"
import SearchInput from "./components/SearchInput"

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  useEffect(() => {
    getAll().then(response => {
      setCountries(response.data)
    })
  }
    , [])

  useEffect(() => {
    if (search.length > 0) {
      getSearch(search).then(response => {
        setCountries([response.data])
      }).catch(error => {
        getAll().then(response => {
          setCountries(response.data.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase())))
        })
      })
    }
  }
    , [search])


  return (
    <div>
      <h1>Countries</h1>
      <h3>Search by name</h3>
      <SearchInput search={search} setSearch={setSearch} />
      <List countries={countries} setSearch={setSearch} />
    </div>
  )
}

export default App