<template>
  <div class="error flex items-center justify-center h-screen" v-if="error">
    <el-result icon="error" title="本RSS阅读器目前尚不支持移动设备" :sub-title="`您的设备宽度为 ${width}，低于支持的最小宽度 1024px`">
    </el-result>
  </div>
  <router-view v-else></router-view>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'
const width = ref(window.innerWidth)
const error = ref(false)
const updateWidth = () => {
  width.value = window.innerWidth;
  if (width.value < 1024) {
    error.value = true;
  } else {
    error.value = false;
  }
};
onMounted(() => {
  if (window.innerWidth < 1024) {
    error.value = true
  }
  window.addEventListener('resize', updateWidth);
})
onUnmounted(() => {
  window.removeEventListener('resize', updateWidth);
});
</script>
