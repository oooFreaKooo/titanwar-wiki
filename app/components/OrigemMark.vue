<template>
    <span
        class="size-11 shrink-0 overflow-hidden rounded-full bg-[radial-gradient(circle_at_50%_42%,#7ef7f3,#2fbfc0_46%,#147e8c)]"
    >
        <img
            :src="src"
            alt=""
            class="size-full object-cover"
        >
    </span>
</template>

<script lang="ts" setup>
defineProps<{
    src: string
}>()
</script>
