import axios from 'axios'

const API_URL = 'http://localhost:8000/api/v1'

export default axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'token': JSON.parse(localStorage.getItem('loginData')).token
  }
})
