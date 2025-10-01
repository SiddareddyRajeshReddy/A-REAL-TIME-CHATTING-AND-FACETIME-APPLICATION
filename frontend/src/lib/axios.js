import axios from 'axios'
const BaseUrl = 'http://localhost:5001/api'

export const axiosInstance = axios.create({
    baseURL: BaseUrl,
    withCredentials: true//send cookies with request
})