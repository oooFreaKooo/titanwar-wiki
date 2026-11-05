<template>
    <UiCommandDialog
        v-model:open="open"
        title="Search heroes"
        description="Jump to a hero by name, subtitle, class, or role."
    >
        <UiCommandInput placeholder="Search heroes" />
        <UiCommandList>
            <UiCommandEmpty>No heroes match that search.</UiCommandEmpty>
            <UiCommandGroup
                v-for="group in groups"
                :key="group.name"
                :heading="group.name"
            >
                <UiCommandItem
                    v-for="hero in group.heroes"
                    :key="hero.id"
                    :value="`${hero.name} ${hero.title} ${hero.class} ${hero.role} ${hero.id}`"
                    :text="hero.name"
                    @select="go(hero)"
                >
                    <img
                        v-if="heroPortrait(hero)"
                        :src="heroPortrait(hero)"
                        alt=""
                        class="size-8 rounded-md object-contain"
                    >
                    <span class="min-w-0 flex-1 truncate">
                        {{ hero.name }}
                        <span
                            v-if="hero.title"
                            class="text-muted-foreground"
                        > · {{ hero.title }}</span>
                    </span>
                    <UiCommandShortcut :shortcut="hero.class" />
                </UiCommandItem>
            </UiCommandGroup>
        </UiCommandList>
    </UiCommandDialog>
</template>

<script lang="ts" setup>
import type { Hero } from '~/composables/useHeroes'

const { open } = useHeroSearch()
const { heroes } = useHeroes()
const router = useRouter()

const groups = computed(() =>
    heroClasses
        .map(name => ({
            name,
            heroes: heroes.filter(hero => hero.class === name),
        }))
        .filter(group => group.heroes.length),
)

function go (hero: Hero) {
    open.value = false
    router.push(`/heroes/${hero.id}`)
}

function onKeydown (event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        open.value = !open.value
    }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>
