<template>
    <UiCard
        as-child
        class="h-full gap-0 overflow-visible py-0 transition-colors hover:bg-accent/30"
    >
        <NuxtLink
            :to="`/heroes/${hero.id}`"
            class="relative flex h-full flex-col"
        >
            <div class="bg-muted relative overflow-hidden rounded-t-xl">
                <img
                    v-if="heroPortrait(hero)"
                    :src="heroPortrait(hero)"
                    :alt="`Portrait of ${hero.name}`"
                    class="aspect-square w-full object-contain"
                    loading="lazy"
                >
                <div
                    class="from-card pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t to-transparent"
                    aria-hidden="true"
                />
                <UiPopover v-if="assetPath(hero.factionIcon)">
                    <UiPopoverTrigger as-child>
                        <button
                            type="button"
                            class="absolute top-1.5 left-1.5"
                            :aria-label="`${hero.faction}. ${hero.factionAdvantage}`"
                            @click.stop.prevent
                        >
                            <img
                                :src="assetPath(hero.factionIcon)"
                                :alt="hero.faction"
                                class="size-8 rounded-full object-contain drop-shadow-md"
                            >
                        </button>
                    </UiPopoverTrigger>
                    <UiPopoverContent class="w-56 p-3 text-left">
                        <p class="text-sm font-medium">{{ hero.faction }}</p>
                        <p class="text-muted-foreground mt-1 text-xs leading-relaxed">{{ hero.factionAdvantage }}</p>
                    </UiPopoverContent>
                </UiPopover>
            </div>
            <img
                v-if="rarityIcon(hero.rarity)"
                :src="rarityIcon(hero.rarity)"
                :alt="rarityName(hero.rarity)"
                class="pointer-events-none absolute top-1 right-1 z-10 size-10 object-contain drop-shadow-md sm:size-11 sm:translate-x-1/2 sm:-translate-y-1/2"
            >
            <div class="flex flex-1 flex-col gap-0.5 px-3 pt-2.5 pb-3">
                <h3 class="truncate text-sm font-semibold tracking-tight">{{ hero.name }}</h3>
                <p
                    v-if="hero.title"
                    class="text-muted-foreground truncate text-xs"
                >{{ hero.title }}</p>
                <p
                    v-if="hero.class || hero.role"
                    class="mt-1.5 flex items-center gap-1 truncate text-xs"
                >
                    <img
                        v-if="assetPath(hero.classIcon)"
                        :src="assetPath(hero.classIcon)"
                        alt=""
                        class="size-3.5 shrink-0 object-contain"
                    >
                    <span
                        v-if="hero.class"
                        :class="classTint(hero.class)"
                    >{{ hero.class }}</span>
                    <span
                        v-if="hero.class && hero.role"
                        class="text-muted-foreground"
                    >·</span>
                    <span
                        v-if="hero.role"
                        class="text-muted-foreground truncate"
                    >{{ hero.role }}</span>
                </p>
            </div>
        </NuxtLink>
    </UiCard>
</template>

<script lang="ts" setup>
import type { Hero } from '~/composables/useHeroes'

defineProps<{ hero: Hero }>()
</script>
