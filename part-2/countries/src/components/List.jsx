import Country from './Country';

const List = ({ countries, setSearch }) => {
    console.log(countries.length);
    if (countries.length > 10) {
        return <p>Too many matches, please make your query more specific.</p>;
    }
    if (countries.length === 1) {
        return <Country country={countries[0]} />;
    }
    if (countries.length === 0) {
        return <p>No countries found.</p>;
    }
    if (countries.length > 1 && countries.length <= 10) {
        return (
            <ul>
                {countries.map((country, index) => (
                    <li key={index}>{country.name.common} <button onClick={() => setSearch(country.name.common)}>Show</button>  </li>
                ))}
            </ul>
        );
    }
};

export default List;