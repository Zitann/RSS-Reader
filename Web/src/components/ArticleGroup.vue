<template>
    <div class="article-group flex flex-col h-full">
       <div class="top flex items-center justify-between p-4">
            <h1 class=" font-black text-2xl">{{ titleIsFavorited == true? '收藏':(articleList[0]?articleList[0].article.feed.title: "" )}}</h1>
            <ul class="btns flex items-center space-x-1">
                <li class="hover:bg-theme-color-1 hover:shadow-lg hover:rounded-lg p-0.5" @click="refreshArticleBtnClick" title="同步">
                    <img class="translate-x-[-2000px] drop-shadow-[2000px_0px_rgba(0,0,0,0.5)]" :src="refresh">
                </li>
                <li class="hover:bg-theme-color-1 hover:shadow-lg hover:rounded-lg p-0.5" @click="isAllClick" :title="isAll?'未读':'全部'">
                    <img class="translate-x-[-2000px] drop-shadow-[2000px_0px_rgba(0,0,0,0.5)]" :src="isAll?round_re:round_fi">
                </li>
                <li class="hover:bg-theme-color-1 hover:shadow-lg hover:rounded-lg p-0.5" @click="markAllArticleIsRead"title="全部标记已读">
                    <img class="translate-x-[-2000px] drop-shadow-[2000px_0px_rgba(0,0,0,0.5)]" :src="check">
                </li>
            </ul>
       </div>
       <ul class="articles overflow-auto flex-1 border-r-2 border-gray-300" v-if="!isLoading">
            <li v-for="article in (update==true?updateArticleList:props.articleList)" :key="article.id" class="item flex items-center justify-between p-4 hover:bg-gray-300" @click="articleClick(article.article.id)">
                <div class="flex items-center w-11/12">
                    <img class="size-2 rounded-full translate-x-[-1000px] drop-shadow-[1000px_0px_rgb(255,92,0)]" :src="article.is_read?'':round_fi">
                    <p class=" text-base ml-2">{{ article.article.title }}</p>
                </div>
                <div class=" flex items-center hover:bg-theme-color-1 hover:shadow-lg hover:rounded-lg cursor-pointer" @click.stop="starClick(article.article.id)" :title="article.is_favorited?'取消收藏':'收藏'">
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
import { ref, watch} from 'vue'
import round_fi from "../assets/round_cute_fi.svg"
import round_re from "../assets/round_cute_re.svg"
import refresh from "../assets/refresh_2_cute_re.svg"
import check from "../assets/check_circle_cute_re.svg"
import star from "../assets/star_cute_fi.svg"
import { markArticleApi } from '../api'
import { getArticleListApi } from '../api'
const isLoading = ref(false)
const isAll = ref(true)
const update = ref(false)
const updateArticleList = ref<any[]>([])
const props = defineProps<{
    articleList: any[],
    titleIsFavorited:Boolean
}>();

watch(() => props.articleList, (newVal) => {
    console.log('articleList', newVal)
    update.value = false
})

const refreshArticleBtnClick = async () => {
    isLoading.value = true;
    isAll.value = true
    if(props.titleIsFavorited == true){
        const params = {
            is_favorited: true
        }
        const res = await getArticleListApi(params)
        if(res.data.code == 'success'){
            updateArticleList.value = res.data.data
            update.value = true
            console.log('refresh success')
        }else{
            console.log(res.data.data)
        }
        
    }else{
        const params = {
            feed_id: props.articleList[0].article.feed_id
        }
        const res = await getArticleListApi(params)
        if(res.data.code == 'success'){
            updateArticleList.value = res.data.data
            update.value = true
            console.log('refresh success')
        }else{
            console.log(res.data.data)
        }
    }
    isLoading.value = false
}

const isAllClick = async() => {
    isAll.value = !isAll.value
    isLoading.value = true;
    if(props.titleIsFavorited == false){
        if(isAll.value){
            const params = {
                feed_id: props.articleList[0].article.feed_id
            }
            const res = await getArticleListApi(params)
            if(res.data.code == 'success'){
                updateArticleList.value = res.data.data
                update.value = true
                console.log('isAll success')
            }else{
                console.log(res.data.data)
            }
        }else{
            const params = {
                feed_id: props.articleList[0].article.feed_id,
                is_read: false
            }
            const res = await getArticleListApi(params)
            if(res.data.code == 'success'){
                updateArticleList.value = res.data.data
                update.value = true
                console.log('isAll success')
            }else{
                console.log(res.data.data)
            }
        }
    }else{
        if(isAll.value){
            const params = {
                is_favorited: true
            }
            const res = await getArticleListApi(params)
            if(res.data.code == 'success'){
                updateArticleList.value = res.data.data
                update.value = true
                console.log('isAll success')
            }else{
                console.log(res.data.data)
            }
        }else{
            const params = {
                is_favorited: true,
                is_read: false
            }
            const res = await getArticleListApi(params)
            if(res.data.code == 'success'){
                updateArticleList.value = res.data.data
                update.value = true
                console.log('isAll success')
            }else{
                console.log(res.data.data)
            }
        }

    }
    isLoading.value = false
}

const emits = defineEmits(['article-selected']);

const articleClick = (id:number) => {
    emits('article-selected', id);
    console.log('articleClick', id);
    mark_is_read(id)
};

const mark_is_read = async (id: number) => {
    const article = props.articleList.find(article => article.article.id === id);
    if (!article) {
        return;
    }
    const data = {
        article_id: [id],
        is_read: true
    }
    const res = await markArticleApi(data)
    if(res.data.code == 'success'){
        article.is_read = true
    }else{
        console.log('标记失败')
    }
    console.log('mark_is_read', id);
};

const markAllArticleIsRead = async () => {
    if(update.value == true){
        const data = {
            article_id: updateArticleList.value.map(article => article.article.id),
            is_read: true
        }
        const res = await markArticleApi(data)
        if(res.data.code == 'success'){
        props.articleList.forEach(article => article.is_read = true)
    }else{
        console.log('标记失败')
    }
    }else{
        const data = {
            article_id: props.articleList.map(article => article.article.id),
            is_read: true
        }
        const res = await markArticleApi(data)
        if(res.data.code == 'success'){
        props.articleList.forEach(article => article.is_read = true)
    }else{
        console.log('标记失败')
    }
    }
    
    
    console.log('markAllArticleIsRead');
};

const starClick = async (id: number) => {
    const article = props.articleList.find(article => article.article.id === id);
    if (!article) {
        return;
    }
    const data = {
        article_id: [id],
        is_favorited: !article.is_favorited
    }
    const res = await markArticleApi(data)
    if(res.data.code == 'success'){
        article.is_favorited = !article.is_favorited
    }else{
        console.log('收藏失败')
    }
    console.log('starClick', id);
};

</script>