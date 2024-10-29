import { baseUrl } from "./env";
import axios from "axios";
import tokenStore from "./store";
const service = axios.create({
    baseURL: baseUrl,
})

// 请求拦截器
service.interceptors.request.use(
    config => {
        const token = tokenStore()
        if (token.token) {
            config.headers.Authorization = `Bearer ${token.token}`
        }
        return config
    },
    error => {
        console.log(error)
        return error
    }
)

// 向应拦截器
service.interceptors.response.use(
    error => {
        console.log(error)
        return error
    }
)
export default service