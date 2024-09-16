const SearchInput = ({ search, setSearch }) => {
    return (
        <div>
            <input onChange={(e) => setSearch(e.target.value)} />
        </div>
    )
}

export default SearchInput