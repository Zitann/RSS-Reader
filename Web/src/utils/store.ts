import {defineStore} from 'pinia'
import { watch } from 'vue';

const tokenStore = defineStore("token", {
    state: () => ({
        token: localStorage.getItem('token') || '',
    }),
    actions: {
        setToken(token: string) {
            this.token = token
        }
    }
})

// 创建 store 实例
const store = tokenStore();

// 监听 token 的变化并更新 localStorage
watch(
  () => store.token,
  (newToken) => {
    localStorage.setItem('token', newToken);
  },
  { immediate: true }
);

export default tokenStore