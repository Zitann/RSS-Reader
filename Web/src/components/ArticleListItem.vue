<template>
    <div class="article-list-item">
        <div class="info">
            <p><Icon type="ios-person-outline" />{{ article.author }}</p>
            <p>{{ $moment(new Date(article.pubDate)).format('A hh:mm') }}</p>
        </div>
        <div class="title">
            <p @click="handleArticleOpen(article.link)">{{ article.title }}</p>
            <div class="action">
                <Icon type="md-star-outline" />
                <Icon type="md-time" />
            </div>
        </div>
        <div class="category">
            <p v-for="(c,index) in article.categories" :key="index">
               <Icon type="ios-pricetag-outline" />{{ c }}
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name:'article-list-item',
    props:{
        article:{
            type:Object,
            required:true,
        }
    },
    methods:{
        //打开文章链接
        handleArticleOpen(url){
            window.open(url,'_blank')
        }
    }
}
</script>