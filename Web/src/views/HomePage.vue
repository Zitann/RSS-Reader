<template>
    <div class="home-page w-screen h-screen bg-theme-color-1 flex items-center justify-center">
        <div class="center-content bg-theme-color-white w-3/4 h-5/6 rounded-md shadow-lg shadow-theme-color-3 flex md:w-full md:h-full">
            <div class=" w-1/6 bg-theme-color-2 rounded-md">
                <SiderBar/>
            </div>
            <div class="w-1/6">
                <ArticleGroup/>
            </div>
            <div class="w-4/6">
                <ArticleDetails/>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import SiderBar from '../components/SiderBar.vue'
import ArticleGroup from '../components/ArticleGroup.vue'
import ArticleDetails from '../components/ArticleDetails.vue';
import { ElNotification } from 'element-plus'  // 用于消息通知
import {  } from '../api';
import tokenStore from '../utils/store';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
const token = tokenStore()  // 使用token.token对token进行操作
const router = useRouter()
onMounted(()=>{
    if(!token.token){
        ElNotification({
            title: '未登录',
            message: '请先登录',
            type: 'warning'
        })
        router.push('/login')
    }
})

</script>