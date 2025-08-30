import Axios from 'axios'

const apiConfig = {
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}

const axios = Axios.create(apiConfig)

export default axios
