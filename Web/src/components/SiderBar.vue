<template>
    <div class="sider-bar text-theme-color-white h-full relative">
        <div class="user flex items-center justify-center">
            <img class="w-20 h-20 rounded-full my-5" :src="userAvatar">
        </div>
        <div class="menu">
            <ul class=" bg-theme-color-2 flex items-center justify-evenly">
                <li v-for="item in menuList" :key="item.index" @click="typeSelect(item.index)" class=" py-2 px-1 cursor-pointer hover:bg-theme-color-1 hover:shadow-lg hover:rounded-xl" :title="item.title">
                    <img class="s-10 translate-x-[-1000px] drop-shadow-[1000px_0px_rgba(0,0,0,0.5)]" :src="item.icon" :style="{filter:activeIndex === item.index ? item.color : ''}">
                </li>
            </ul>
        </div>
        <div class="mt-2 text-zinc-100 font-bold text-lg">
            <div class="star flex items-center m-2 rounded-lg hover:bg-theme-color-1 hover:shadow-md cursor-pointer">
                <img class="s-6 m-3 translate-x-[-1000px]" :src="star" :style="{filter:'drop-shadow(1000px 0px #f59e0b)'}">
                <p>收藏</p>
            </div>
            <ul class="rss-list bg-theme-color-2 flex flex-col m-2 ">
                <li v-for="rss in rssList" :key="rss.id" class="p-3 cursor-pointer hover:bg-theme-color-1 hover:shadow-md hover:rounded-lg" :title="rss.name">
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

const userAvatar = ref('https://avatars.githubusercontent.com/u/23514289?v=4')
const menuList = ref([
    { index: 1, title: '文章', icon: paper,color:'drop-shadow(1000px 0px rgb(255,92,0))'},
    { index: 2, title: '社交媒体', icon: twitter,color:'drop-shadow(1000px 0px rgb(2,132,199))'},
    { index: 3, title: '图片', icon: pic ,color:'drop-shadow(1000px 0px rgb(22,163,74))'},
    { index: 4, title: '视频', icon: youtube,color:'drop-shadow(1000px 0px rgb(220,38,38))' },
    { index: 5, title: '音频', icon: mic,color:'drop-shadow(1000px 0px rgb(147,51,234))' },
    { index: 6, title: '通知', icon: announcement ,color:'drop-shadow(1000px 0px rgb(202,138,4))'},
])
const rssList = ref([
    { id: 1, name: '知乎', url: 'https://www.zhihu.com/rss' },
    { id: 2, name: '微博', url: 'https://rss.weibo.com/2650085724/9e2a3e2f/rss' },
    { id: 3, name: '微信', url: 'https://rsshub.app/wechat/wemedia/officialaccount/gh_3e8e0f3f9e0b' },
    { id: 4, name: '豆瓣', url: 'https://rsshub.app/douban/mine/126212' },
    { id: 5, name: '简书', url: 'https://rsshub.app/jianshu/user/9104f3b6b3b3' },
    { id: 6, name: 'CSDN', url: 'https://rsshub.app/csdn/blog/qq_38225558' },
    { id: 7, name: '博客园', url: 'https://rsshub.app/cnblogs/qq_38225558' },
    { id: 8, name: '掘金', url: 'https://rsshub.app/juejin/user/5c4cbf8ff265da611b7baf3e' },
    { id: 9, name: '开发者头条', url: 'https://rsshub.app/wechat/wemedia/officialaccount/gh_6b8a6f7f1e9c' },
    { id: 10, name: 'V2EX', url: 'https://rsshub.app/v2ex/topics/latest' },
    { id: 11, name: '36氪', url: 'https://rsshub.app/36kr/newsflashes' },
    { id: 12, name: '虎扑', url: 'https://rsshub.app/hupu/bbs/7' },
    { id: 13, name: '知乎日报', url: 'https://rsshub.app/zhihu/daily' },
    { id: 14, name: '果壳', url: 'https://rsshub.app/guokr/scientific' },
    { id: 15, name: 'IT之家', url: ''}
])
const activeIndex = ref(1)
const typeSelect = (index: number) => {
    activeIndex.value = index
}
</script>