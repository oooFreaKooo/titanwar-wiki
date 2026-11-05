<template>
    <UiContainer class="py-8 sm:py-12 lg:py-16">
        <div class="max-w-2xl">
            <p class="text-primary text-sm font-semibold">
                Hero catalog
            </p>
            <h1 class="mt-2 text-3xl font-semibold text-balance lg:text-4xl">
                Heroes
            </h1>
            <p class="text-muted-foreground mt-3 text-lg text-balance">
                Portraits, classes, and skills for every hero.
            </p>
        </div>

        <div class="mt-8 flex flex-wrap items-center gap-2">
            <label class="relative block w-full sm:min-w-48 sm:flex-1">
                <Icon
                    name="lucide:search"
                    class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                />
                <UiInput
                    :model-value="query"
                    class="h-9 pr-3 pl-9"
                    placeholder="Search heroes"
                    aria-label="Search heroes"
                    @update:model-value="query = String($event)"
                />
            </label>

            <HeroFilterMenu
                v-model="heroClass"
                label="Class"
                icon="lucide:swords"
                :options="classOptions"
            />
            <HeroFilterMenu
                v-model="faction"
                label="Faction"
                icon="lucide:orbit"
                :options="factionOptions"
            />
            <HeroFilterMenu
                v-model="rarity"
                label="Rarity"
                icon="lucide:gem"
                :options="rarityOptions"
            />
            <HeroFilterMenu
                v-model="role"
                label="Role"
                icon="lucide:shield"
                :options="roleOptions"
                searchable
            />
            <HeroFilterMenu
                v-model="sort"
                label="Sort"
                icon="lucide:arrow-up-down"
                :options="sorts"
                all-value="name"
                hide-all
                always-show-value
            />
        </div>

        <p
            class="text-muted-foreground mt-4 text-sm"
            role="status"
        >
            {{ visible.length }} {{ visible.length === 1 ? "hero" : "heroes" }}
        </p>

        <HeroEmpty
            v-if="!visible.length"
            class="mt-6"
            @pick="query = $event"
            @clear="clearFilters"
        />

        <ul
            v-else
            class="mt-4 grid grid-cols-2 gap-4 pt-5 md:grid-cols-4 md:gap-6 lg:grid-cols-5 xl:grid-cols-6"
        >
            <li
                v-for="hero in visible"
                :key="hero.id"
            >
                <HeroCard :hero="hero" />
            </li>
        </ul>
    </UiContainer>
</template>

<script lang="ts" setup>
useSeoMeta({
    title: 'Heroes · Titan War Wiki',
    description: 'Browse Titan War heroes, their classes, and their skills.',
})

const { heroes } = useHeroes()
const route = useRoute()
const router = useRouter()

const query = ref(stringQuery('q'))
const heroClass = ref(stringQuery('class') || 'All')
const faction = ref(stringQuery('faction') || 'All')
const rarity = ref(stringQuery('rarity') || 'All')
const role = ref(stringQuery('role') || 'All')
const sort = ref<'name' | 'rarity'>(route.query.sort === 'rarity' ? 'rarity' : 'name')

const roleIcons: Record<string, string> = {
    'Area damage': 'lucide:radius',
    'Assassin': 'lucide:skull',
    'Buffer': 'lucide:sparkles',
    'Burst damage': 'lucide:zap',
    'Control': 'lucide:lock',
    'Debuffer': 'lucide:trending-down',
    'Healer': 'lucide:heart-pulse',
    'Sustained Damage': 'lucide:flame',
    'Tank': 'lucide:shield',
}

const classOptions = heroClasses.map((item) => {
    const sample = heroes.find(hero => hero.class === item)
    return {
        value: item,
        label: item,
        image: sample ? assetPath(sample.classIcon) : '',
    }
})
const factionOptions = heroFactions.map(hero => ({
    value: hero.faction,
    label: hero.faction,
    image: assetPath(hero.factionIcon),
}))
const rarityOptions = heroRarities.map(item => ({
    value: item,
    label: rarityName(item),
    image: rarityIcon(item),
}))
const roleOptions = heroRoles.map(item => ({
    value: item,
    label: item,
    icon: roleIcons[item] ?? 'lucide:shield',
}))
const sorts = [
    { value: 'name', label: 'Name', icon: 'lucide:a-large-small' },
    { value: 'rarity', label: 'Rarity', icon: 'lucide:gem' },
]

const visible = computed(() => {
    const needle = query.value.trim().toLowerCase()
    const matched = heroes.filter((hero) => {
        if (heroClass.value !== 'All' && hero.class !== heroClass.value) { return false }
        if (faction.value !== 'All' && hero.faction !== faction.value) { return false }
        if (rarity.value !== 'All' && hero.rarity !== rarity.value) { return false }
        if (role.value !== 'All' && hero.role !== role.value) { return false }
        if (!needle) { return true }
        return [
            hero.name, hero.title, hero.class, hero.role, hero.secondaryRole, String(hero.id),
        ]
            .join(' ')
            .toLowerCase()
            .includes(needle)
    })
    return matched.sort((left, right) => {
        if (sort.value === 'rarity') {
            return (right.rarityId ?? 0) - (left.rarityId ?? 0) || left.name.localeCompare(right.name)
        }
        return left.name.localeCompare(right.name)
    })
})

function stringQuery (key: string) {
    const value = route.query[key]
    return typeof value === 'string' ? value : ''
}

function clearFilters () {
    query.value = ''
    heroClass.value = 'All'
    faction.value = 'All'
    rarity.value = 'All'
    role.value = 'All'
}

watch([
    query, heroClass, faction, rarity, role, sort,
], () => {
    router.replace({
        query: {
            q: query.value || undefined,
            class: heroClass.value === 'All' ? undefined : heroClass.value,
            faction: faction.value === 'All' ? undefined : faction.value,
            rarity: rarity.value === 'All' ? undefined : rarity.value,
            role: role.value === 'All' ? undefined : role.value,
            sort: sort.value === 'name' ? undefined : sort.value,
        },
    })
})
</script>
