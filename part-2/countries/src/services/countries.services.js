import axios from 'axios';

const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/";
const weatherUrl = "https://api.openweathermap.org/"

const API_KEY = import.meta.env.VITE_APP_API_KEY;

export const getAll = () => {
    return axios.get(baseUrl + "all");
}

export const getSearch = (search) => {
    return axios.get(baseUrl + "name/" + search);
}

export const getWeather = (city) => {
    return axios.get(weatherUrl + "geo/1.0/direct?q=" + city + "&appid=" + API_KEY).then(response => {
        const { lat, lon } = response.data[0];
        return axios.get(weatherUrl + "data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + API_KEY);
    })
}