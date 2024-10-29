import { baseUrl } from "./env";
import axios from "axios";
const service = axios.create({
    baseURL: baseUrl,
})

//请求拦截器
// service.interceptors.request.use(
//     config => {
//         return config
//     },
//     error => {
//         console.log(error)
//         return error
//     }
// )

// 向应拦截器
// service.interceptors.response.use(
//     response => {
//         return response.data
//     },
//     error => {
        
//     }
// )
export default service