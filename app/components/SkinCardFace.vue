<template>
    <div>
        <div
            class="bg-muted relative overflow-hidden rounded-xl"
            :class="selected ? 'ring-ring ring-2' : ''"
        >
            <img
                :src="assetPath(portrait)"
                :alt="`Portrait of ${name}`"
                class="aspect-[3/4] w-full object-contain object-top transition duration-500 group-hover:scale-105"
                loading="lazy"
            >
            <span
                class="bg-background/90 absolute top-2.5 left-2.5 rounded-md px-2 py-0.5 text-[11px] font-semibold backdrop-blur"
                :class="skinGradeTint(grade)"
            >
                {{ grade }}
            </span>
        </div>

        <div class="mt-3 space-y-1">
            <p
                v-if="caption"
                class="text-muted-foreground text-xs tracking-wide uppercase"
            >
                {{ caption }}
            </p>
            <p class="font-medium leading-snug">
                {{ name }}
            </p>
            <p
                v-if="bonusLine"
                class="text-muted-foreground text-xs leading-relaxed"
            >
                {{ bonusLine }}
            </p>
            <p
                v-if="globalLine"
                class="text-muted-foreground text-xs leading-relaxed"
            >
                All heroes {{ globalLine }}
            </p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { HeroSkinStat } from '~/composables/useHeroes'

const props = defineProps<{
    name: string
    grade: string
    portrait: string
    caption?: string
    bonuses?: HeroSkinStat[]
    global?: HeroSkinStat[]
    selected?: boolean
}>()

const bonusLine = computed(() => skinStatLine(props.bonuses))
const globalLine = computed(() => skinStatLine(props.global))
</script>
