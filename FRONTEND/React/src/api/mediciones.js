import axios from 'axios'

const API = "http://localhost:8000/api/mediciones/"

export const getMediciones = () => axios.get(API)
export const getMedicionesByComponente = (componenteId) => axios.get(`${API}?componente=${componenteId}`)
export const createMedicion = (data) => axios.post(API, data)
export const updateMedicion = (id, data) => axios.put(`${API}${id}/`, data)
export const deleteMedicion = (id) => axios.delete(`${API}${id}/`)