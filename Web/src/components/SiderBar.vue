<template>
    <div class="sider-bar text-theme-color-white h-full flex flex-col">
        <div class="user flex items-center justify-center relative">
            <img class="w-20 h-20 rounded-full my-5" :src="userAvatar">
            <div class="absolute top-auto left-auto rounded-full w-20 h-20 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300" @click="exitClick">
                <img class="w-8 h-8 translate-x-[-1000px] drop-shadow-[1000px_0px_rgba(255,255,255,1.00)]" :src="exit" alt="Exit Icon">
            </div>
        </div>
        <div class="menu">
            <ul class=" bg-theme-color-2 flex items-center justify-evenly">
                <li v-for="item in menuList" :key="item.index" @click="typeSelect(item.index)" class=" py-2 px-1 cursor-pointer hover:bg-theme-color-1 hover:shadow-lg hover:rounded-xl" :title="item.title">
                    <img class="s-10 translate-x-[-1000px] drop-shadow-[1000px_0px_rgba(0,0,0,0.5)]" :src="item.icon" :style="{filter:activeIndex === item.index ? item.color : ''}">
                </li>
            </ul>
        </div>
        <div class="mt-2 text-zinc-100 font-bold text-lg flex-1 flex flex-col overflow-hidden">
            <div class="star flex items-center m-2 rounded-lg hover:bg-theme-color-1 hover:shadow-md cursor-pointer h-fit" @click="activeRssid=0" :class="{'bg-theme-color-1 shadow-md rounded-lg':0 === activeRssid}">
                <img class="s-6 m-3 translate-x-[-1000px]" :src="star" :style="{filter:'drop-shadow(1000px 0px #f59e0b)'}">
                <p>收藏</p>
            </div>
            <ul class="rss-list bg-theme-color-2 flex flex-col m-2 overflow-y-auto flex-1">
                <li v-for="rss in props.rssList" :key="rss.id" class="p-3 cursor-pointer hover:bg-theme-color-1 hover:shadow-md hover:rounded-lg" :title="rss.name" @click="rssClick(rss.id)" :class="{'bg-theme-color-1 shadow-md rounded-lg':rss.id === activeRssid}">
                    <p>{{ rss.name }}</p>
                </li>
            </ul>
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import paper from "../assets/paper_cute_fi.svg"
import twitter from "../assets/twitter_cute_fi.svg"
import pic from "../assets/pic_cute_fi.svg"
import youtube from "../assets/youtube_cute_fi.svg"
import mic from "../assets/mic_cute_fi.svg"
import announcement from "../assets/announcement_cute_fi.svg"
import star from "../assets/star_cute_fi.svg"
import exit from "../assets/exit_cute_re.svg"
import tokenStore from '../utils/store';
import { useRouter } from 'vue-router';
import { getArticleListApi } from '../api'

const token = tokenStore()  // 使用token.token对token进行操作
const router = useRouter()
const emit = defineEmits(['typeSelect','articleList'])

const userAvatar = ref('https://avatars.githubusercontent.com/u/23514289?v=4')
const menuList = ref([
    { index: 1, title: '文章', icon: paper,color:'drop-shadow(1000px 0px rgb(255,92,0))'},
    { index: 2, title: '社交媒体', icon: twitter,color:'drop-shadow(1000px 0px rgb(2,132,199))'},
    { index: 3, title: '图片', icon: pic ,color:'drop-shadow(1000px 0px rgb(22,163,74))'},
    { index: 4, title: '视频', icon: youtube,color:'drop-shadow(1000px 0px rgb(220,38,38))' },
    { index: 5, title: '音频', icon: mic,color:'drop-shadow(1000px 0px rgb(147,51,234))' },
    { index: 6, title: '通知', icon: announcement ,color:'drop-shadow(1000px 0px rgb(202,138,4))'},
])
const props = defineProps<{
    rssList: any[]
}>()
const activeIndex = ref(1)
const activeRssid = ref(-1)
const typeSelect = (index: number) => {
    activeIndex.value = index
    emit('typeSelect', index)
}
const exitClick = () => {
    token.token = ''
    router.push('/login')
}

const rssClick = async (rssId: number) => {
    activeRssid.value = rssId
    const params = {
        feed_id: rssId
    }
    const res = await getArticleListApi(params)
    if(res.data.code == 'success'){
        console.log(res.data.data)
    }else{
        console.log(res.data.data)
    }
    emit('articleList', res.data.data)
}
</script>