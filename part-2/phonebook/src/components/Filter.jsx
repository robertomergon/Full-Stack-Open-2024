const Filter = ({ filter, onFilter }) => {
    return (
        <div>
            <input value={filter} onChange={onFilter} />
        </div>
    )
}

export default Filter