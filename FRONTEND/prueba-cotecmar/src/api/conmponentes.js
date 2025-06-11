import axios from 'axios'

const API = "http://localhost:8000/api/componentes/"

export const getComponentes = () => axios.get(API)
export const createComponente = (data) => axios.post(API, data)
export const updateComponente = (id, data) => axios.put(`${API}${id}/`, data)
export const deleteComponente = (id) => axios.delete(`${API}${id}/`)