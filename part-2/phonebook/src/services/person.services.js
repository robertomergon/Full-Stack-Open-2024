import axios from 'axios';

//const baseUrl = "https://full-stack-open-2024-zckw.onrender.com/api/persons";

const baseUrl = "http://localhost:3001/api/persons";

export const getAll = () => {
    return axios.get(baseUrl);
}

export const create = (newObject) => {
    return axios.post(baseUrl, newObject);
}

export const deleteContact = (id) => {
    return axios.delete(`${baseUrl}/${id}`);
}

export const update = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject);
}