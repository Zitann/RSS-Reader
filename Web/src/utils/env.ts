let baseUrl = ''
let routerMode = 'hash'
let avatarUrl = ''
let baseImgPath
if(process.env.NODE_ENV == 'development'){
    baseUrl = 'http://localhost:3000/'
    baseImgPath = 'http://localhost:3000'
    avatarUrl = 'http://localhost:3000'
}else{
    // 此处只需要修改api.5i21.cn为你的后端地址
    baseUrl = 'http://localhost:3000'
    // 此处只需要修改api.5i21.cn为你的后端地址
    baseImgPath = 'http://localhost:3000'
    // 此处需要修改为自己的头像地址
    avatarUrl = 'http://localhost:3000'
}
export {
    baseUrl,
    routerMode,
    baseImgPath,
    avatarUrl
}