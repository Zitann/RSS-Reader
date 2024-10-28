<template>
    {{ article }}
</template>

<script setup lang="ts">
import { ref } from 'vue'

const article = ref({
    "id": 22,
    "title": "从果香到泥煤：苏格兰威士忌入门指北",
    "link": "https://sspai.com/prime/story/scotch-whisky-101",
    "feed_id": 1,
    "feed": {
      "title": "少数派"
    },
    "content": "苏格兰作为威士忌生产历史最悠久最有影响力的地区之一，风味极其丰富，是非常适合新手探索的一个产地。<a href=\"https://sspai.com/prime/story/scotch-whisky-101\" target=\"_blank\">查看全文</a><p>本文为会员文章，出自<a href=\"https://sspai.com/prime/precog/single\" target=\"_blank\">《单篇文章》</a >，订阅后可阅读全文。</p >"
})
</script>