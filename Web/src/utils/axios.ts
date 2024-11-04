import { baseUrl } from "./env";
import axios from "axios";
import tokenStore from "./store";
import { ElNotification } from "element-plus";
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
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            ElNotification.error({
                title: "错误",
                message: "未授权，请重新登录"
            })
            const token = tokenStore()
            token.token = ""
            window.location.href = "/login"
        }
        return Promise.reject(error)
    }
)
export default service