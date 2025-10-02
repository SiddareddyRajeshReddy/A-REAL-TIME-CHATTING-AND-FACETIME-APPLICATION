import axios from 'axios'
const BaseUrl = import.meta.env.MODE === "development"?"http://loaclhost:5001/api":"/api"

export const axiosInstance = axios.create({
    baseURL: BaseUrl,
    withCredentials: true//send cookies with request
})