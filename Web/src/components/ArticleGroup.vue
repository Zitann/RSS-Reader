<template>
    <div class="article-group flex flex-col h-full">
       <div class="top flex items-center justify-between p-4">
            <h1 class=" font-black text-2xl">{{ rssName }}</h1>
            <ul class="btns flex items-center space-x-1">
                <li class="hover:bg-theme-color-1 hover:shadow-lg hover:rounded-lg p-0.5" @click="refreshArticleBtnClick" title="同步">
                    <img class="translate-x-[-1000px] drop-shadow-[1000px_0px_rgba(0,0,0,0.5)]" :src="refresh">
                </li>
                <li class="hover:bg-theme-color-1 hover:shadow-lg hover:rounded-lg p-0.5" @click="isAllClick" :title="isAll?'全部':'未读'">
                    <img class="translate-x-[-1000px] drop-shadow-[1000px_0px_rgba(0,0,0,0.5)]" :src="isAll?round_re:round_fi">
                </li>
                <li class="hover:bg-theme-color-1 hover:shadow-lg hover:rounded-lg p-0.5" title="全部标记已读">
                    <img class="translate-x-[-1000px] drop-shadow-[1000px_0px_rgba(0,0,0,0.5)]" :src="check">
                </li>
            </ul>
       </div>
       <ul class="articles overflow-auto flex-1 border-r-2 border-gray-300" v-if="!isLoading">
            <li v-for="article in articleList" :key="article.id" class="item flex items-center justify-between p-4 hover:bg-gray-300" @click="articleClick(article.id)">
                <div class="flex items-center">
                    <img class="size-2 rounded-full translate-x-[-1000px] drop-shadow-[1000px_0px_rgb(255,92,0)]" :src="article.is_read?'':round_fi">
                    <p class="text-lg ml-2">{{ article.title }}</p>
                </div>
                <div class="flex items-center hover:bg-theme-color-1 hover:shadow-lg hover:rounded-lg cursor-pointer" @click.stop="starClick(article.id)" :title="article.is_favorited?'取消收藏':'收藏'">
                    <img class="size-5 m-1" :src="star" :style="{filter:'drop-shadow(1000px 0px #f59e0b)'}" :class="{'translate-x-[-1000px]':article.is_favorited}">
                </div>
            </li>
       </ul>
       <div class="loading flex-1 flex items-center justify-center" v-else>
            <svg class="animate-spin fill-theme-color-2" xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none"><path fill="#fff" fill-opacity=".01" d="M36 0v24H0V0z"/><circle cx="18" cy="18" r="14" stroke="#79a8a9" stroke-width="3" opacity=".1"/><path stroke="#79a8a9" stroke-linecap="round" stroke-width="4" d="M18 3a8.958 8.958 0 0 0-6.225 2.5"/></svg>
       </div>
    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import round_fi from "../assets/round_cute_fi.svg"
import round_re from "../assets/round_cute_re.svg"
import refresh from "../assets/refresh_2_cute_re.svg"
import check from "../assets/check_circle_cute_re.svg"
import star from "../assets/star_cute_fi.svg"
const rssName = ref('少数派')
const isLoading = ref(false)
const isAll = ref(true)
const articleList = ref([
    {id:1,title:'少数派1',is_read:true,is_favorited:false},
    {id:2,title:'少数派2',is_read:false,is_favorited:false},
    {id:3,title:'少数派3',is_read:false,is_favorited:false},
    {id:4,title:'少数派4',is_read:true,is_favorited:false},
    {id:5,title:'少数派5',is_read:false,is_favorited:true},
    {id:6,title:'少数派6',is_read:false,is_favorited:false},
    {id:7,title:'少数派7',is_read:true,is_favorited:false},
    {id:8,title:'少数派8',is_read:false,is_favorited:false},
    {id:9,title:'少数派9',is_read:false,is_favorited:false},
    {id:10,title:'少数派10',is_read:true,is_favorited:false},
    {id:11,title:'少数派11',is_read:false,is_favorited:false},
    {id:12,title:'少数派12',is_read:false,is_favorited:false},
    {id:13,title:'少数派13',is_read:true,is_favorited:false},
    {id:14,title:'少数派14',is_read:false,is_favorited:false},
    {id:15,title:'少数派15',is_read:false,is_favorited:false},
    
])
const refreshArticleBtnClick = () => {
    console.log('refreshArticleBtnClick')
}
const isAllClick = () => {
    isAll.value = !isAll.value
    console.log('isAllClick')
}

const emits = defineEmits(['article-selected']);

const articleClick = (id:number) => {
    emits('article-selected', id);
    console.log('articddddddddddddleClick', id);
};

const starClick = (id:number) => {
    console.log('starClick',id)
}
</script>