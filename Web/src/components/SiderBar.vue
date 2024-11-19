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
            <div class="star flex items-center m-2 rounded-lg hover:bg-theme-color-1 hover:shadow-md cursor-pointer h-fit" @click="handleFavoriteClick" :class="{'bg-theme-color-1 shadow-md rounded-lg':0 === activeRssid}">
                <img class="s-6 m-3 translate-x-[-1000px]" :src="star" :style="{filter:'drop-shadow(1000px 0px #f59e0b)'}">
                <p>收藏</p>
            </div>
            <ul class="rss-list bg-theme-color-2 flex flex-col m-2 overflow-y-auto flex-1">
                <li v-for="rss in props.rssList" :key="rss.id" class="p-3 cursor-pointer hover:bg-theme-color-1 hover:shadow-md hover:rounded-lg flex items-center justify-between" :title="rss.name" @click="rssClick(rss.id)" :class="{'bg-theme-color-1 shadow-md rounded-lg':rss.id === activeRssid}">
                    <p>{{ rss.name }}</p>
                    <el-dropdown trigger="click" v-show="rss.id === activeRssid" @click.stop>
                        <span class="el-dropdown-link text-zinc-100">
                        ···
                        </span>
                        <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="handleDeleteRss">取消订阅</el-dropdown-item>
                            <el-dropdown-item @click="handleChangeTag">修改类别</el-dropdown-item>
                        </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </li>
            </ul>
        </div>
    </div>
    <IModal v-if="isModalVisible" @click="closeModal">
        <h2 class="text-lg font-bold mb-4">{{ ModalData.title }}</h2>
        <p>{{ ModalData.content }}</p>
        <el-select
        class="mt-8"
        v-model="ModalData.select"
        placeholder="Select"
        size="large"
        style="width: 240px"
        v-if="ModalData.select!=-1"
        >
            <el-option
                v-for="item in menuList"
                :key="item.index"
                :label="item.title"
                :value="item.index"
            />
        </el-select>
        <div class="action mt-8 flex justify-center">
            <div class="login-button p-1 text-white w-1/3 cursor-pointer rounded shadow-sm bg-theme-color-2 mr-5 text-center"
                @click="submitModal">确定</div>
            <div class="register-button p-1 text-white w-1/3 cursor-pointer rounded shadow-sm bg-theme-color-1 text-center"
                @click="closeModal">取消</div>
        </div>
    </IModal>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import IModal from './IModal.vue'
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
import{deleteFeedApi} from '../api'
import{updateFeedApi} from '../api'
import { ElNotification } from 'element-plus'

const token = tokenStore()  // 使用token.token对token进行操作
const router = useRouter()
const emit = defineEmits(['typeSelect','articleList','title_is_favorited'])

const isModalVisible = ref(false)
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
const ModalData = ref({
    title: '',
    content: '',
    select: activeIndex.value
})
const typeSelect = (index: number) => {
    activeIndex.value = index
    emit('typeSelect', index)
    console.log('typeSelect',index)
    //favoriteArticleList()
}
const exitClick = () => {
    ModalData.value = {
        title: '退出登录',
        content: '确定退出登录吗？',
        select: -1
    }
    isModalVisible.value = true
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

const favoriteArticleList = async () => {
    
    const params = {
        is_favorited: true,
        tag_id: activeIndex.value
    }
    console.log('favoriteArticleList')
    const res = await getArticleListApi(params)
    if(res.data.code == 'success'){
        console.log(res.data.data)
    }else{
        console.log(res.data.data)
    }
    emit('articleList', res.data.data)
    emit('title_is_favorited',true)
}
const handleFavoriteClick = () => {
    favoriteArticleList();
    activeRssid.value = 0;
}
const handleDeleteRss = () => {
    ModalData.value = {
        title: '取消订阅',
        content: '确定取消订阅吗？',
        select: -1
    }
    isModalVisible.value = true
}
const handleChangeTag = () => {
    ModalData.value = {
        title: '修改类别',
        content: '请选择新的类别',
        select: activeIndex.value
    }
    isModalVisible.value = true
}
const closeModal = () => {
    isModalVisible.value = false
}
const submitModal = () => {
    isModalVisible.value = false
    if(ModalData.value.title == '取消订阅'){
        deleteRss()
    }else if(ModalData.value.title == '修改类别'){
        changeTag(ModalData.value.select)
    }else if(ModalData.value.title == '退出登录'){
        token.token = ''
        router.push('/login')
    }
}

//删除订阅源
// export function deleteFeedApi(feed_id: number) {
//     return fetch.delete(`/feed/${feed_id}`)
// }
const deleteRss = async () => {
    const res = await deleteFeedApi(activeRssid.value)
    if(res.data.code == 'success'){
        console.log('取消订阅成功')
        typeSelect(activeIndex.value)
        ElNotification({
            title: '取消订阅成功',
            message: '取消订阅成功',
            type: 'success'
        })
    }else{
        console.log(res.data.data)
    }
    console.log('deleteRss',activeRssid.value)
}

const changeTag = async (newtag_id:number) => {
    const params = {
        tag_id: newtag_id
    }
    const res = await updateFeedApi(activeRssid.value,params)
    console.log(activeRssid.value)

    if(res.data.code == 'success'){
        console.log(res.data.data)
        typeSelect(activeIndex.value)
    }else{
        console.log(res.data.data)
    }
    console.log('changeTag',newtag_id)
}

</script>