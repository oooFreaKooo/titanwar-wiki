<template>
    <UiContainer class="py-8 sm:py-12 lg:py-16">
        <div class="max-w-2xl">
            <p class="text-primary text-sm font-semibold">
                Gear catalog
            </p>
            <h1 class="mt-2 text-3xl font-semibold text-balance lg:text-4xl">
                Items
            </h1>
            <p class="text-muted-foreground mt-3 text-lg text-balance">
                Armors, Origems, and artifacts.
            </p>
        </div>

        <UiTabs
            v-model="category"
            class="mt-8"
        >
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
                <UiTabsList class="h-auto w-full flex-wrap justify-start sm:w-auto">
                    <UiTabsTrigger value="armors">
                        Armors
                    </UiTabsTrigger>
                    <UiTabsTrigger value="origems">
                        Origems
                    </UiTabsTrigger>
                    <UiTabsTrigger value="artifacts">
                        Artifacts
                    </UiTabsTrigger>
                </UiTabsList>
                <label class="relative block w-full sm:ml-auto sm:max-w-xs">
                    <Icon
                        name="lucide:search"
                        class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                    />
                    <UiInput
                        v-model="query"
                        class="h-9 pr-3 pl-9"
                        :placeholder="placeholder"
                        :aria-label="placeholder"
                    />
                </label>
            </div>

            <p
                class="text-muted-foreground mt-4 text-sm"
                role="status"
            >
                {{ resultCount }} {{ resultLabel }}
            </p>

            <UiTabsContent value="armors">
                <div
                    v-if="armorSets.length"
                    class="mt-6 space-y-10"
                >
                    <section
                        v-for="group in armorSets"
                        :key="group.set"
                    >
                        <h2 class="text-lg font-semibold">
                            {{ group.set }}
                        </h2>
                        <p class="text-muted-foreground mt-1 text-sm">
                            {{ group.pieces.length }} {{ group.pieces.length === 1 ? "piece" : "pieces" }}
                        </p>
                        <ul class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            <li
                                v-for="piece in group.pieces"
                                :key="piece.id"
                                class="bg-card flex gap-3 rounded-xl border px-3 py-3"
                            >
                                <img
                                    v-if="piece.icon"
                                    :src="assetPath(piece.icon)"
                                    alt=""
                                    class="bg-muted size-12 shrink-0 rounded-md object-contain"
                                >
                                <div class="min-w-0">
                                    <p class="text-muted-foreground text-[11px] font-medium tracking-[0.14em] uppercase">
                                        {{ piece.slot }}
                                    </p>
                                    <p class="text-sm font-medium">
                                        {{ piece.name }}
                                    </p>
                                    <p
                                        v-if="statLine(piece.stats)"
                                        class="text-muted-foreground mt-1 text-xs"
                                    >
                                        {{ statLine(piece.stats) }}
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </section>
                </div>
                <ItemEmpty
                    v-else
                    @clear="query = ''"
                />
            </UiTabsContent>

            <UiTabsContent value="origems">
                <ul
                    v-if="visibleOrigems.length"
                    class="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
                >
                    <li
                        v-for="piece in visibleOrigems"
                        :key="piece.name"
                    >
                        <button
                            type="button"
                            class="bg-card hover:bg-muted/40 flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left"
                            @click="openOrigem(piece)"
                        >
                            <OrigemMark
                                v-if="piece.icon"
                                :src="assetPath(piece.icon)"
                            />
                            <p class="text-sm font-medium">
                                {{ piece.name }}
                            </p>
                        </button>
                    </li>
                </ul>
                <ItemEmpty
                    v-else
                    @clear="query = ''"
                />
            </UiTabsContent>

            <UiTabsContent value="artifacts">
                <div
                    v-if="artifactSets.length"
                    class="mt-6 space-y-10"
                >
                    <section
                        v-for="group in artifactSets"
                        :key="group.set"
                    >
                        <h2 class="text-lg font-semibold">
                            {{ group.set }}
                        </h2>
                        <p class="text-muted-foreground mt-1 text-sm">
                            {{ group.pieces.length }} {{ group.pieces.length === 1 ? "piece" : "pieces" }}
                        </p>
                        <ul class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            <li
                                v-for="piece in group.pieces"
                                :key="piece.id"
                            >
                                <button
                                    type="button"
                                    class="bg-card hover:bg-muted/40 flex w-full gap-3 rounded-xl border px-3 py-3 text-left"
                                    @click="openArtifact(piece)"
                                >
                                    <img
                                        v-if="piece.icon"
                                        :src="assetPath(piece.icon)"
                                        alt=""
                                        class="bg-muted size-12 shrink-0 rounded-md object-contain"
                                    >
                                    <div class="min-w-0">
                                        <p class="text-sm font-medium">
                                            {{ piece.name }}
                                        </p>
                                        <p
                                            v-if="piece.description && piece.description !== piece.name"
                                            class="text-muted-foreground mt-1 text-xs leading-relaxed"
                                        >
                                            <SkillText :text="piece.description" />
                                        </p>
                                    </div>
                                </button>
                            </li>
                        </ul>
                    </section>
                </div>
                <ItemEmpty
                    v-else
                    @clear="query = ''"
                />
            </UiTabsContent>
        </UiTabs>

        <UiDialog v-model:open="detailOpen">
            <UiDialogContent
                v-if="origem"
                class="max-h-[85vh] overflow-y-auto sm:max-w-lg"
                :title="origem.name"
            >
                <template #content>
                    <div class="flex items-center gap-3">
                        <OrigemMark
                            v-if="origem.icon"
                            :src="assetPath(origem.icon)"
                        />
                        <p class="text-muted-foreground text-sm">
                            {{ origemNote }}
                        </p>
                    </div>
                    <ul class="mt-5 space-y-4">
                        <li
                            v-for="bonus in origem.bonuses"
                            :key="bonus.level"
                        >
                            <p class="text-sm font-medium">
                                {{ bonus.level }} {{ bonus.requirement }} ({{ bonus.count }}/{{ bonus.count }})
                            </p>
                            <p class="text-muted-foreground mt-1 text-sm leading-relaxed">
                                <SkillText :text="bonus.text" />
                            </p>
                        </li>
                    </ul>
                </template>
            </UiDialogContent>
            <UiDialogContent
                v-else-if="artifact"
                class="max-h-[85vh] overflow-y-auto sm:max-w-xl"
                :title="artifactTitle"
            >
                <template #content>
                    <div class="bg-muted/50 overflow-hidden rounded-xl border">
                        <img
                            v-if="artifact.art || artifact.icon"
                            :src="assetPath(artifact.art || artifact.icon)"
                            alt=""
                            class="mx-auto h-64 w-full object-contain"
                        >
                    </div>
                    <p
                        v-if="statLine(artifact.stats)"
                        class="mt-4 text-sm font-medium"
                    >
                        {{ statLine(artifact.stats) }}
                    </p>
                    <section
                        v-if="artifact.echo.length"
                        class="mt-5"
                    >
                        <h3 class="text-sm font-medium">
                            {{ artifact.echoTitle }}
                        </h3>
                        <ul class="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                            <li
                                v-for="(stat, index) in artifact.echo"
                                :key="`${stat.name}-${index}`"
                                class="text-muted-foreground text-sm"
                            >
                                {{ stat.name }} {{ stat.value }}
                            </li>
                        </ul>
                    </section>
                    <section
                        v-if="artifact.effects.length"
                        class="mt-5"
                    >
                        <h3 class="text-sm font-medium">
                            Artifact Effect
                        </h3>
                        <ul class="mt-2 space-y-3">
                            <li
                                v-for="effect in artifact.effects"
                                :key="effect.level"
                            >
                                <p class="text-sm leading-relaxed">
                                    <span class="font-medium">{{ effect.label }}</span>
                                    <SkillText :text="effect.description" />
                                </p>
                            </li>
                        </ul>
                    </section>
                    <section
                        v-if="artifact.info && artifact.info !== artifact.name"
                        class="mt-5"
                    >
                        <h3 class="text-sm font-medium">
                            Artifact Info
                        </h3>
                        <p class="text-muted-foreground mt-1 text-sm leading-relaxed">
                            {{ artifact.info }}
                        </p>
                    </section>
                </template>
            </UiDialogContent>
        </UiDialog>
    </UiContainer>
</template>

<script lang="ts" setup>
import type { ArtifactItem, ItemStat, OrigemSet } from '~/composables/useItems'

useSeoMeta({
    title: 'Items · Titan War Wiki',
    description: 'Titan War armors, Origems, and artifacts.',
})

const { armors, origems, artifacts, origemNote } = useItems()
const category = ref('armors')
const query = ref('')
const detailOpen = ref(false)
const origem = ref<OrigemSet | null>(null)
const artifact = ref<ArtifactItem | null>(null)

const artifactTitle = computed(() =>
    artifact.value ? `${artifact.value.name}+${artifact.value.level}` : '',
)

function openOrigem (piece: OrigemSet) {
    artifact.value = null
    origem.value = piece
    detailOpen.value = true
}

function openArtifact (piece: ArtifactItem) {
    origem.value = null
    artifact.value = piece
    detailOpen.value = true
}

const placeholder = computed(() => {
    if (category.value === 'origems') { return 'Search Origems' }
    if (category.value === 'artifacts') { return 'Search artifacts' }
    return 'Search armors'
})

function matches (text: string) {
    const needle = query.value.trim().toLowerCase()
    return !needle || text.toLowerCase().includes(needle)
}

function statLine (stats: ItemStat[]) {
    return stats.map(stat => `${stat.name} ${stat.value}`).join(' · ')
}

const visibleArmors = computed(() =>
    armors.filter(piece => matches(`${piece.name} ${piece.set} ${piece.slot} ${statLine(piece.stats)}`)),
)

const armorSets = computed(() => {
    const order: string[] = []
    const groups = new Map<string, typeof visibleArmors.value>()
    for (const piece of visibleArmors.value) {
        const list = groups.get(piece.set)
        if (list) { list.push(piece) }
        else {
            groups.set(piece.set, [ piece ])
            order.push(piece.set)
        }
    }
    return order.map(set => ({ set, pieces: groups.get(set) ?? [] }))
})

const visibleOrigems = computed(() =>
    origems.filter(piece => matches(`${piece.name} ${piece.bonuses.map(bonus => `${bonus.level} ${bonus.text}`).join(' ')}`)),
)

const visibleArtifacts = computed(() =>
    artifacts.filter(piece => matches(`${piece.name} ${piece.set} ${piece.description}`)),
)

const artifactSets = computed(() => {
    const order: string[] = []
    const groups = new Map<string, typeof visibleArtifacts.value>()
    for (const piece of visibleArtifacts.value) {
        const list = groups.get(piece.set)
        if (list) { list.push(piece) }
        else {
            groups.set(piece.set, [ piece ])
            order.push(piece.set)
        }
    }
    return order.map(set => ({ set, pieces: groups.get(set) ?? [] }))
})

const resultCount = computed(() => {
    if (category.value === 'origems') { return visibleOrigems.value.length }
    if (category.value === 'artifacts') { return visibleArtifacts.value.length }
    return visibleArmors.value.length
})

const resultLabel = computed(() => {
    const count = resultCount.value
    if (category.value === 'origems') { return count === 1 ? 'Origem' : 'Origems' }
    if (category.value === 'artifacts') { return count === 1 ? 'artifact' : 'artifacts' }
    return count === 1 ? 'piece' : 'pieces'
})
</script>
