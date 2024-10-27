<template>
    <div class="home-page w-screen h-screen bg-theme-color-1 flex items-center justify-center">
        <div class="center-content bg-theme-color-white w-3/4 h-5/6 rounded-md shadow-lg shadow-theme-color-3 flex">
            <div class=" w-1/6 bg-theme-color-2 rounded-md">
                <SiderBar/>
            </div>
            <!-- <div :style="{background:$store.isLoading?'#d4dcdcc4':'none'}">
                <SearchButton v-if="articleGroups.length > 0"/>
                <ArticleGroup v-for="(group,index) in articleGroups" :key="index" :group="group"/>
                <div class="nothing" v-if="articleGroups.length === 0">
                   <Icon type="ios-snow-outline"  size="300" style="color:#c5d0d0a1;"/>
                </div> -->
                <!-- <Loading class="loading-wrapper" v-if="$store.isLoading"/> -->
                <!-- <svg class="animate-spin h-5 w-5 mr-3 " viewBox="0 0 24 24" v-if="$store.isLoading"></svg>
            </div> -->
        </div>
    </div>
</template>


<script setup lang="ts">
import SiderBar from '../components/SiderBar.vue'
// import SearchButton from '../components/SearchButton.vue'
// import ArticleGroup from '../components/ArticleGroup.vue'

</script>