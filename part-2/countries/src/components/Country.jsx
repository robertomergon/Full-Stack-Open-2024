import { useEffect, useState } from "react";
import { getWeather } from "../services/countries.services";
const Country = ({ country }) => {
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        getWeather(country.capital[0]).then(response => {
            setWeather(response.data);
        })
    }, [country.capital])

    const toCelsius = (kelvin) => {
        return Math.round(kelvin - 273.15);
    }

    return (
        <div>
            <h1>{country.name.common}</h1>
            <p>Capital: {country.capital[0]}</p>
            <p>Population: {country.population}</p>
            <p>Area: {country.area} km²</p>
            <h2>Languages</h2>
            <ul>
                {Object.values(country.languages).map((language, index) => (
                    <li key={index}>{language}</li>
                ))}
            </ul>
            <img src={country.flags.png} alt={country.name.common} style={{ width: '100px' }} />
            <h2>Weather in {country.capital[0]}</h2>
            {weather ? (
                <div>
                    <p>Temperature: {toCelsius(weather.main.temp)} °C</p>
                    <p>Feels like: {toCelsius(weather.main.feels_like)}°C</p>
                    <p>Weather: {weather.weather[0].description}</p>
                    <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} />
                    <p>Humidity: {weather.main.humidity}%</p>
                    <p>Wind: {weather.wind.speed} m/s</p>
                </div>
            ) : (
                <p>Loading weather...</p>
            )}
        </div>
    );
}

export default Country;