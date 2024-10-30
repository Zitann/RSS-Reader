<template>
    <div class="article-details px-20 pt-16 pb-4 flex flex-col overflow-hidden h-full">
        <a class="title p-4 hover:bg-gray-300 hover:rounded-md block" :href="article.link" target="_blank">
            <h1 class=" text-3xl font-bold">{{ article.title }}</h1>
            <p class=" mt-3 text-gray-500">{{ article.feed.title }}</p>
        </a>
        <article class="content p-4 flex-1 overflow-auto" v-html="article.content"/>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { getArticleApi } from '../api/index.ts';


const props = defineProps({
  article_id: {
    type: Number,
    required: true
  }
});


const article = ref({
    "id": -1,
    "title": "",
    "link": "",
    "feed_id": 1,
    "feed": {
      "title": "",
      "tag_id": 0
    },
    "content": "",
    "statuses": [
      {
        "user_id": 2,
        "is_read": true,
        "is_favorited": true
      }
    ]
  })

const fetchArticle = async () => {
  try {
    const response = await getArticleApi(props.article_id);
    article.value = response.data.data;
  } catch (error) {
    console.error('Failed to fetch article:', error);
  }
};
defineExpose({fetchArticle})

watch(() => props.article_id, fetchArticle);

</script>