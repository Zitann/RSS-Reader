import {defineStore} from 'pinia'

const tokenStore = defineStore("token", {
    state: () => ({
        token: ""
    }),
    actions: {
        setToken(token: string) {
            this.token = token
        }
    }
})

export default tokenStore