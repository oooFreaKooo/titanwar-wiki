<template>
    <NuxtLink
        v-if="to"
        :to="to"
        class="group block text-left"
    >
        <SkinCardFace
            :name="name"
            :grade="grade"
            :portrait="portrait"
            :caption="caption"
            :bonuses="bonuses"
            :global="globalBonus"
        />
    </NuxtLink>
    <button
        v-else
        type="button"
        class="group block w-full text-left"
        :aria-pressed="selected"
        @click="$emit('select')"
    >
        <SkinCardFace
            :name="name"
            :grade="grade"
            :portrait="portrait"
            :caption="caption"
            :bonuses="bonuses"
            :global="globalBonus"
            :selected="selected"
        />
    </button>
</template>

<script lang="ts" setup>
import type { HeroSkinStat } from '~/composables/useHeroes'

defineProps<{
    name: string
    grade: string
    portrait: string
    caption?: string
    bonuses?: HeroSkinStat[]
    globalBonus?: HeroSkinStat[]
    to?: string
    selected?: boolean
}>()

defineEmits<{ select: [] }>()
</script>
