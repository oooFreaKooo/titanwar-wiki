<template>
    <UiContainer class="py-8 sm:py-12 lg:py-16">
        <div class="max-w-2xl">
            <p class="text-primary text-sm font-semibold">
                Portrait gallery
            </p>
            <h1 class="mt-2 text-3xl font-semibold text-balance lg:text-4xl">
                Skins
            </h1>
            <p class="text-muted-foreground mt-3 text-lg text-balance">
                Legendary, Epic, and Excellent looks. Each card opens the hero who wears it.
            </p>
        </div>

        <label class="relative mt-8 block w-full max-w-2xl">
            <Icon
                name="lucide:search"
                class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            />
            <UiInput
                v-model="query"
                class="h-9 pr-3 pl-9"
                placeholder="Search skins or heroes"
                aria-label="Search skins or heroes"
            />
        </label>

        <div
            v-if="groups.length"
            class="mt-10 space-y-12"
        >
            <section
                v-for="group in groups"
                :key="group.grade"
            >
                <h2 class="text-lg font-semibold">
                    {{ group.grade }}
                </h2>
                <p class="text-muted-foreground mt-1 text-sm">
                    {{ group.skins.length }} {{ group.skins.length === 1 ? "skin" : "skins" }}
                </p>
                <ul class="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    <li
                        v-for="skin in group.skins"
                        :key="skin.id"
                    >
                        <SkinCard
                            :name="skin.name"
                            :grade="skin.grade"
                            :portrait="skin.portrait"
                            :caption="skin.heroName"
                            :bonuses="skin.bonuses"
                            :global-bonus="skin.global"
                            :to="`/heroes/${skin.heroId}`"
                        />
                    </li>
                </ul>
            </section>
        </div>

        <UiEmpty
            v-else
            class="mt-10"
        >
            <UiEmptyHeader>
                <UiEmptyMedia>
                    <Icon
                        name="lucide:sparkles"
                        class="text-muted-foreground size-6"
                    />
                </UiEmptyMedia>
                <UiEmptyTitle>No skins match</UiEmptyTitle>
                <UiEmptyDescription>Try another name, or clear the search.</UiEmptyDescription>
            </UiEmptyHeader>
            <UiEmptyContent>
                <UiButton
                    variant="outline"
                    @click="query = ''"
                >
                    Clear search
                </UiButton>
            </UiEmptyContent>
        </UiEmpty>
    </UiContainer>
</template>

<script lang="ts" setup>
useSeoMeta({
    title: 'Skins · Titan War Wiki',
    description: 'Unofficial fan wiki of Legendary, Epic, and Excellent Titan War skins.',
})

const { heroes } = useHeroes()
const query = ref('')

const skins = computed(() =>
    heroes.flatMap(hero => hero.skins ?? []).sort((left, right) => left.name.localeCompare(right.name)),
)

const groups = computed(() => {
    const needle = query.value.trim().toLowerCase()
    const visible = needle
        ? skins.value.filter(skin =>
            `${skin.name} ${skin.heroName} ${skin.grade}`.toLowerCase().includes(needle),
        )
        : skins.value
    return skinGradeOrder
        .map(grade => ({
            grade,
            skins: visible.filter(skin => skin.grade === grade),
        }))
        .filter(group => group.skins.length)
})
</script>
