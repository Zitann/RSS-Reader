<template>
    <div class="home-page w-screen h-screen bg-theme-color-1 flex items-center justify-center">
        <div class="center-content bg-theme-color-white w-3/4 h-5/6 rounded-md shadow-lg shadow-theme-color-3 flex">
            <div class=" w-1/6 bg-theme-color-2 rounded-md">
                <SiderBar/>
            </div>
            <div class="w-1/6">
                <ArticleGroup/>
            </div>
            <div class="w-4/6">
                <ArticleDetails/>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import SiderBar from '../components/SiderBar.vue'
import ArticleGroup from '../components/ArticleGroup.vue'
import ArticleDetails from '../components/ArticleDetails.vue';
</script>