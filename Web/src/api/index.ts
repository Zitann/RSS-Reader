import fetch from '../utils/axios'
//账号注册
export function registerApi(data:any) {
    return fetch.post('/register', data)
}
//账号登录
export function loginApi(data:any) {
    return fetch.post('/login', data)
}