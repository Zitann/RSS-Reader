import fetch from '../utils/axios'
//账号注册
export function registerApi(data:any) {
    return fetch.post('/register', data)
}
//账号登录
export function loginApi(data:any) {
    return fetch.post('/login', data)
}
//获取订阅源列表
export function getFeedListApi(tag_id: number) {
    return fetch.get('/feed', {
        params: {tag_id}
    })
}
//获取订阅源详情
export function getFeedDetailApi(feed_id: number) {
    return fetch.get(`/feed/${feed_id}`)
}
//添加订阅源
export function addFeedApi(data:any) {
    return fetch.post('/feed', data)
}
//删除订阅源
export function deleteFeedApi(feed_id: number) {
    return fetch.delete(`/feed/${feed_id}`)
}
//修改订阅源
export function updateFeedApi(feed_id:number,data:any) {
    return fetch.put(`/feed/${feed_id}`, data)
}
//获取文章列表
export function getArticleListApi(params: any) {
    return fetch.get('/article', {
        params
    })
}
//获取文章
export function getArticleApi(article_id: number) {
    return fetch.get(`/article/${article_id}`)
}
//标记文章
export function markArticleApi(data:any) {
    return fetch.put('/mark', data)
}