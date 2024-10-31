<template>
    <div class="home-page w-screen h-screen bg-theme-color-1 flex items-center justify-center">
        <div class="center-content bg-theme-color-white rounded-md shadow-lg shadow-theme-color-3 flex w-full h-full xl:w-3/4 xl:h-5/6">
            <div class=" w-1/6 bg-theme-color-2 rounded-md relative">
                <SiderBar :rss-list="rssList" @typeSelect="handleFeedList" @articleList="handleCurrentArticleList"/>
                <button class="absolute bottom-5 right-5 bg-theme-color-3 h-10 w-10 text-center leading-10 rounded-lg text-zinc-100 font-bold text-2xl shadow-2xl hover:bg-gray-300 hover:text-black" @click="showModal" >+</button>
            </div>
            <div class="w-3/12">
                <ArticleGroup @article-selected="handleArticleSelected" :articleList="currentArticleList" />
            </div>
            <div class="w-7/12">
                <ArticleDetails :article_id="currentArticleId" ref="articleDetail"/>
            </div>
        </div>

        <!-- Modal -->
        <div v-if="isModalVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeModal">
            <div class=" bg-white p-8 rounded-lg shadow-lg" @click.stop>
                <h2 class="text-lg font-bold mb-4">添加订阅源</h2>
                <el-input placeholder="请输入完整的URL" v-model="url" />
                <div class="action mt-8 flex justify-center">
                    <div class="login-button p-1 text-white w-1/3 cursor-pointer rounded shadow-sm bg-theme-color-2 mr-5 text-center"
                        @click="submitModal">确定</div>
                    <div class="register-button p-1 text-white w-1/3 cursor-pointer rounded shadow-sm bg-theme-color-1 text-center"
                        @click="closeModal">取消</div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import SiderBar from '../components/SiderBar.vue'
import ArticleGroup from '../components/ArticleGroup.vue'
import ArticleDetails from '../components/ArticleDetails.vue';
import { ElNotification } from 'element-plus'  // 用于消息通知
import { getFeedListApi, addFeedApi } from '../api';
import tokenStore from '../utils/store';
import { useRouter } from 'vue-router';
import { onMounted, ref} from 'vue';

const token = tokenStore()  // 使用token.token对token进行操作
const router = useRouter()
const currentArticleId = ref(-1)  // 当前文章id
const currentArticleList = ref([])  // 当前文章列表
const currentType = ref(1)  // 当前文章类型
const url = ref('')
const rssList = ref([])
onMounted(()=>{
    if(!token.token){
        router.push('/login')
        return
    }
    getFeedList(1)
})

const getFeedList = async (tag_id:number) => {
    currentType.value = tag_id
    const res = await getFeedListApi(tag_id)
    if(res.data.code == 'success'){
        rssList.value = res.data.data.map((item:any)=>{
            return {
                id: item.feed.id,
                name: item.feed.title
            }
        })
    }else{
        ElNotification({
            title: '获取文章列表失败',
            message: res.data.data,
            type: 'error'
        })
    }
}

const handleFeedList = (tag_id:number) => {
    currentArticleId.value = -1
    currentArticleList.value = []
    getFeedList(tag_id)
}

const addRss = async (data:object) => {
    const res = await addFeedApi(data)
    console.log(res)
    if(res.data.code == 'success'){
        ElNotification({
            title: '添加成功',
            message: '添加成功',
            type: 'success'
        })
        getFeedList(1)
    }else{
        ElNotification({
            title: '添加失败',
            message: res.data.data,
            type: 'error'
        })
    }
}

const articleDetail = ref()

const handleArticleSelected = (id:number) => {
    currentArticleId.value = id
   // articleDetail.value.fetchArticle()
}
const handleCurrentArticleList = (list:any) => {
    currentArticleList.value = list
}

const isModalVisible = ref(false)
const showModal = () => {
    isModalVisible.value = true;
}
const closeModal = () => {
    isModalVisible.value = false;
    url.value = ''
}
const submitModal = () => {
    addRss({tag_id:currentType.value,url:url.value})
    closeModal();
}
</script>