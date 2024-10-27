<template>
    <div class="article-group">
        <p>{{ group.title }}</p>
        <div class="article-list">
            <ArticleListItem v-for="(item,index) in group.items" :key="index" :article="item"/>
        </div>
    </div>
</template>


<script>
import ArticleListItem from './ArticleListItem.vue'

export default {
    name:'article-group',
    components:{
        ArticleListItem,
    },
    props:{
        group:{
            type:Object,
            required:true,
        }
    }
}
</script>