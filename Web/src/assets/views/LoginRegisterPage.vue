<template>
    <div class="login-register-page w-screen h-screen bg-theme-color-1 flex flexa items-center justify-center">
        <div class="center-content w-1/2 h-3/5 flex rounded-lg overflow-hidden shadow-xl shadow-theme-color-3">
            <div
                class="left-part w-1/2 h-full bg-theme-color-2 text-theme-color-white flex flex-col justify-center p-10">
                <h1 class=" text-5xl mb-7 font-black text-center">Welcome!!</h1>
                <p>{{ welcomeInfo.hitokoto }}</p>
                <p class=" text-right mt-3">- 「 {{ welcomeInfo.from }} 」</p>
            </div>
            <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in"
                :duration="500">
                <!-- 登录 -->
                <div class="right-part flex w-1/2 h-full bg-theme-color-white relative flex-col justify-center p-30"
                    v-if="!isRegister" key="login">
                    <div class="form flex flex-col items-center space-y-3" @keyup.enter="handleLogin">
                        <el-input class="w-8/12" placeholder="邮箱" v-model="loginInfo.email" />
                        <el-input class=" w-8/12" placeholder="密码" type="password" v-model="loginInfo.passwd" />
                    </div>
                    <div class="action mt-8 flex justify-center">
                        <div class="login-button p-1 text-white w-1/3 cursor-pointer rounded shadow-sm bg-theme-color-2 mr-5 text-center"
                            @click="handleLogin">登录</div>
                        <div class="register-button p-1 text-white w-1/3 cursor-pointer rounded shadow-sm bg-theme-color-1 text-center"
                            @click="isRegister = !isRegister">注册</div>
                    </div>
                </div>
                <!-- 注册 -->
                <div class="right-part flex w-1/2 h-full bg-theme-color-white relative flex-col justify-center p-30"
                    v-else key="register">
                    <div class="close-btn absolute right-5 top-5 bg-theme-color-1 text-white h-5 w-5 text-center leading-5 rounded-lg"
                        @click="isRegister = !isRegister">
                        <Close />
                    </div>
                    <div class="form flex flex-col items-center space-y-3" @keyup.enter="handleRegister">
                        <el-input class=" w-8/12" placeholder="邮箱" v-model="registerInfo.email" />
                        <el-input class=" w-8/12" placeholder="密码" type="password" v-model="registerInfo.passwd" />
                        <el-input class=" w-8/12" placeholder="确认密码" type="password" v-model="registerInfo.confirmPasswd" />
                    </div>
                    <div class="action mt-8 flex justify-center">
                        <div class="register-button p-1 text-white w-2/5 cursor-pointer rounded shadow-sm bg-theme-color-1 text-center"
                            @click="handleRegister">注册</div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from "axios";
const welcomeInfo = ref({
    hitokoto: '',
    from: ''
})
const isRegister = ref(false)
const loginInfo = ref({
    email: '',
    passwd: ''
})
const registerInfo = ref({
    email: '',
    passwd: '',
    confirmPasswd: ''
})
onMounted(async () => {
    const res = await axios.get('https://v1.hitokoto.cn')
    welcomeInfo.value.hitokoto = res.data.hitokoto
    welcomeInfo.value.from = res.data.from
})
const handleLogin = () => {
    console.log('login')
}
const handleRegister = () => {
    console.log('register')
}
</script>