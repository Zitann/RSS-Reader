<template>
    <!-- Modal -->
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class=" bg-white p-8 rounded-lg shadow-lg w-1/3" @click.stop>
            <!-- 插槽 -->
            <slot></slot>
        </div>
    </div>
</template>