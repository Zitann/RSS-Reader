<template>
    <div class="search-button">
        <transition name="search-button">
            <input type="text" v-if="isCollapse">
        </transition>
        <Icon type="ios-search" size="20" @click="isCollapse=!isCollapse" :class="{'not-collapse-icon':!isCollapse}"/>
    </div>
</template>


<script>
export default {
    name:'search-button',
    data(){
        return {
            isCollapse:false,
        }
    }
}
</script>