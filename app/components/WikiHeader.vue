<template>
    <header class="bg-background/80 sticky top-0 z-20 border-b backdrop-blur">
        <UiContainer class="flex h-14 items-center gap-2 sm:gap-3">
            <NuxtLink
                to="/"
                class="flex shrink-0 items-center gap-2 font-semibold"
            >
                <img
                    :src="assetPath('images/logo.png')"
                    alt="Titan War"
                    class="aspect-[259/39] h-5 w-auto shrink-0 min-[380px]:h-6 sm:h-7"
                >
                <span class="font-display tracking-tight">Wiki</span>
            </NuxtLink>

            <nav
                class="ml-2 hidden items-center gap-1 sm:flex"
                aria-label="Main"
            >
                <NuxtLink
                    v-for="link in links"
                    :key="link.to"
                    :to="link.to"
                    class="text-muted-foreground hover:text-foreground rounded-md px-3 py-1.5 text-sm font-medium"
                    exact-active-class="bg-muted text-foreground"
                >
                    {{ link.label }}
                </NuxtLink>
            </nav>

            <button
                type="button"
                class="border-input bg-background text-muted-foreground hover:text-foreground ml-auto hidden h-9 w-full max-w-xs items-center gap-2 rounded-md border pr-2 pl-3 text-sm sm:flex"
                @click="open = true"
            >
                <Icon
                    name="lucide:search"
                    class="size-4"
                />
                <span class="flex-1 text-left">Search heroes</span>
                <UiKbd>⌘K</UiKbd>
            </button>

            <div class="ml-auto flex items-center gap-1 sm:ml-0">
                <UiSheet v-model:open="menuOpen">
                    <UiSheetTrigger as-child>
                        <UiButton
                            variant="ghost"
                            size="icon"
                            class="sm:hidden"
                            aria-label="Open menu"
                        >
                            <Icon
                                name="lucide:menu"
                                class="size-5"
                            />
                        </UiButton>
                    </UiSheetTrigger>
                    <UiSheetContent
                        side="left"
                        class="w-72"
                        title="Titan War Wiki"
                        description="Unofficial fan wiki. Heroes, skins, and items."
                    >
                        <template #content>
                            <nav
                                class="flex flex-col gap-1 px-2"
                                aria-label="Mobile"
                            >
                                <NuxtLink
                                    v-for="link in links"
                                    :key="link.to"
                                    :to="link.to"
                                    class="hover:bg-muted flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium"
                                    exact-active-class="bg-muted text-foreground"
                                    @click="menuOpen = false"
                                >
                                    <Icon
                                        :name="link.icon"
                                        class="text-muted-foreground size-4"
                                    />
                                    {{ link.label }}
                                </NuxtLink>
                            </nav>
                        </template>
                    </UiSheetContent>
                </UiSheet>
                <UiButton
                    class="sm:hidden"
                    variant="ghost"
                    size="icon"
                    aria-label="Search heroes"
                    @click="open = true"
                >
                    <Icon
                        name="lucide:search"
                        class="size-5"
                    />
                </UiButton>
                <UiTooltip>
                    <UiTooltipTrigger as-child>
                        <UiButton
                            variant="ghost"
                            size="icon"
                            :aria-label="themeLabel"
                            @click="toggleTheme"
                        >
                            <Icon
                                :name="isDark ? 'lucide:sun' : 'lucide:moon'"
                                class="size-5"
                            />
                        </UiButton>
                    </UiTooltipTrigger>
                    <UiTooltipContent>{{ themeLabel }}</UiTooltipContent>
                </UiTooltip>
            </div>
        </UiContainer>
    </header>
</template>

<script lang="ts" setup>
const { open } = useHeroSearch()
const menuOpen = ref(false)
const links = [
    { label: 'Heroes', to: '/', icon: 'lucide:swords' },
    { label: 'Skins', to: '/skins', icon: 'lucide:sparkles' },
    { label: 'Items', to: '/items', icon: 'lucide:shield' },
]
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const themeLabel = computed(() => (isDark.value ? 'Switch to light mode' : 'Switch to dark mode'))

function toggleTheme () {
    colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>
