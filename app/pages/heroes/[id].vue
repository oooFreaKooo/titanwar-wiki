<template>
    <UiContainer
        v-if="hero"
        class="py-8 sm:py-12 lg:py-16"
    >
        <div class="flex flex-col gap-8 lg:grid lg:grid-cols-[380px_minmax(0,1fr)] lg:items-start">
            <div class="contents lg:flex lg:flex-col lg:gap-8">
                <div class="relative order-2 h-fit lg:order-0">
                    <div class="bg-card overflow-hidden rounded-2xl border shadow-2xl shadow-black/20">
                        <div class="relative">
                            <img
                                v-if="portraitSrc"
                                :src="portraitSrc"
                                :alt="portraitAlt"
                                class="w-full object-contain"
                            >
                            <div
                                class="from-background pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t via-background/70 to-transparent"
                                aria-hidden="true"
                            />
                            <div
                                v-if="hero.skins?.length"
                                class="absolute inset-x-0 bottom-3 flex justify-center gap-2 px-3"
                            >
                                <UiTooltip>
                                    <UiTooltipTrigger as-child>
                                        <button
                                            type="button"
                                            class="size-12 overflow-hidden rounded-md border-2 shadow-md transition"
                                            :class="selectedSkinId === null ? 'border-white' : 'border-white/30 opacity-80 hover:opacity-100'"
                                            :aria-pressed="selectedSkinId === null"
                                            :aria-label="hero.name"
                                            @click="selectedSkinId = null"
                                        >
                                            <img
                                                :src="heroArt(hero)"
                                                alt=""
                                                class="size-full object-cover object-top"
                                            >
                                        </button>
                                    </UiTooltipTrigger>
                                    <UiTooltipContent>{{ hero.name }}</UiTooltipContent>
                                </UiTooltip>
                                <UiTooltip
                                    v-for="skin in skinsByGrade"
                                    :key="skin.id"
                                >
                                    <UiTooltipTrigger as-child>
                                        <button
                                            type="button"
                                            class="size-12 overflow-hidden rounded-md border-2 shadow-md transition"
                                            :class="selectedSkinId === skin.id ? 'border-white' : 'border-white/30 opacity-80 hover:opacity-100'"
                                            :aria-pressed="selectedSkinId === skin.id"
                                            :aria-label="`${skin.grade} ${skin.name}`"
                                            @click="selectedSkinId = skin.id"
                                        >
                                            <img
                                                :src="assetPath(skin.portrait)"
                                                alt=""
                                                class="size-full object-cover object-top"
                                            >
                                        </button>
                                    </UiTooltipTrigger>
                                    <UiTooltipContent class="max-w-64 text-left">
                                        <p class="font-medium">
                                            {{ skin.name }}
                                        </p>
                                        <p
                                            v-if="skin.grade"
                                            class="text-muted-foreground"
                                        >
                                            {{ skin.grade }}
                                        </p>
                                        <p
                                            v-if="skinStatLine(skin.bonuses)"
                                            class="mt-1"
                                        >
                                            {{ skinStatLine(skin.bonuses) }}
                                        </p>
                                        <p
                                            v-if="skinStatLine(skin.global)"
                                            class="text-muted-foreground mt-1"
                                        >
                                            All heroes {{ skinStatLine(skin.global) }}
                                        </p>
                                    </UiTooltipContent>
                                </UiTooltip>
                            </div>
                        </div>
                    </div>
                    <img
                        v-if="rarityIcon(hero.rarity)"
                        :src="rarityIcon(hero.rarity)"
                        :alt="rarityName(hero.rarity)"
                        class="pointer-events-none absolute top-0 right-0 z-10 size-14 translate-x-1/4 -translate-y-1/4 object-contain drop-shadow-lg sm:size-16 sm:translate-x-1/3 sm:-translate-y-1/3"
                    >
                </div>

                <section
                    v-if="hero.exclusive"
                    class="bg-card relative order-3 overflow-hidden rounded-2xl border shadow-2xl shadow-black/20 lg:order-0"
                >
                    <div
                        class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/80 to-transparent"
                        aria-hidden="true"
                    />
                    <div class="p-4">
                        <div class="flex items-start gap-3">
                            <img
                                v-if="hero.exclusive.icon"
                                :src="assetPath(hero.exclusive.icon)"
                                :alt="hero.exclusive.name"
                                class="size-14 shrink-0 rounded-xl bg-amber-400/10 object-contain ring-1 ring-amber-400/25"
                            >
                            <div class="min-w-0 pt-0.5">
                                <h2 class="font-display text-lg leading-tight font-semibold">
                                    {{ exclusiveHeading(hero.exclusive.label) }}
                                </h2>
                                <p class="text-muted-foreground mt-1 text-sm">
                                    {{ hero.exclusive.name }}
                                </p>
                            </div>
                        </div>

                        <div
                            v-if="hero.exclusive.stats.length"
                            class="mt-4"
                        >
                            <p class="text-muted-foreground text-xs">
                                {{
                                    hero.exclusive.level
                                        ? `Max stats, unlocked at level ${hero.exclusive.level}`
                                        : "Max stats"
                                }}
                            </p>
                            <ul class="mt-2 divide-y">
                                <li
                                    v-for="stat in hero.exclusive.stats"
                                    :key="stat.name"
                                    class="flex items-baseline justify-between gap-3 py-1.5"
                                >
                                    <span class="text-muted-foreground text-sm">{{ stat.name }}</span>
                                    <span class="text-sm font-semibold text-amber-700 tabular-nums dark:text-amber-300">
                                        {{ stat.value }}
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div
                            v-if="hero.exclusive.skillName"
                            class="mt-4 border-t pt-4"
                        >
                            <p class="text-muted-foreground text-[11px] font-medium tracking-[0.14em] uppercase">
                                Exclusive gear skill
                            </p>
                            <div class="mt-2 flex items-center gap-2">
                                <img
                                    v-if="hero.exclusive.skillIcon"
                                    :src="assetPath(hero.exclusive.skillIcon)"
                                    alt=""
                                    class="size-9 rounded-full object-cover ring-1 ring-amber-400/30"
                                >
                                <p class="font-medium text-amber-700 dark:text-amber-300">
                                    {{ hero.exclusive.skillName }}
                                </p>
                            </div>
                            <p class="mt-2 text-sm leading-relaxed">
                                <SkillText :text="hero.exclusive.description" />
                            </p>
                            <ol
                                v-if="hero.exclusive.unlocks.length"
                                class="mt-3 space-y-3"
                            >
                                <li
                                    v-for="unlock in hero.exclusive.unlocks"
                                    :key="unlock.level"
                                    class="flex gap-2.5"
                                >
                                    <span
                                        class="mt-0.5 h-fit shrink-0 rounded-md bg-amber-400/10 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700 tabular-nums ring-1 ring-amber-400/20 dark:text-amber-300"
                                    >
                                        Lv.{{ unlock.level }}
                                    </span>
                                    <p class="text-sm leading-relaxed">
                                        <SkillText :text="unlock.description" />
                                    </p>
                                </li>
                            </ol>
                        </div>
                    </div>
                </section>

                <section
                    v-if="awakening"
                    class="bg-card order-3 rounded-2xl border p-4 shadow-2xl shadow-black/20 lg:order-0"
                >
                    <p class="text-muted-foreground text-[11px] font-medium tracking-[0.14em] uppercase">
                        Awakening Skill
                    </p>
                    <div class="mt-3 flex gap-3">
                        <img
                            v-if="skillIcon(awakening)"
                            :src="skillIcon(awakening)"
                            alt=""
                            class="bg-muted size-11 shrink-0 rounded-md object-contain"
                        >
                        <div class="min-w-0">
                            <p class="font-medium">
                                {{ awakening.name }}
                            </p>
                            <p
                                v-if="awakening.description"
                                class="mt-1 text-sm leading-relaxed"
                            >
                                <SkillText :text="awakening.description" />
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            <div class="contents lg:block lg:min-w-0">
                <div class="order-1 lg:order-0">
                    <UiBreadcrumbs
                        :items="[
                            { label: 'Heroes', link: '/', icon: 'lucide:swords' },
                            { label: hero.name, icon: 'lucide:user' },
                        ]"
                    />

                    <div class="mt-4 flex items-start justify-between gap-3">
                        <div class="min-w-0">
                            <h1 class="text-3xl font-semibold text-balance sm:text-4xl">
                                {{ hero.name }}
                            </h1>
                            <div
                                v-if="hero.title || hero.voices?.length"
                                class="mt-1 flex items-center gap-2"
                            >
                                <p
                                    v-if="hero.title"
                                    class="text-muted-foreground text-lg sm:text-xl"
                                >
                                    {{ hero.title }}
                                </p>
                                <UiButton
                                    v-if="hero.voices?.length"
                                    variant="ghost"
                                    size="icon-sm"
                                    class="shrink-0"
                                    aria-label="Play a voice line"
                                    @click="playVoice"
                                >
                                    <Icon
                                        :name="playing ? 'lucide:audio-lines' : 'lucide:volume-2'"
                                        class="size-4"
                                    />
                                </UiButton>
                            </div>
                        </div>
                        <div class="flex shrink-0 gap-2">
                            <UiButton
                                v-if="previous"
                                variant="outline"
                                size="sm"
                                class="px-2.5 sm:px-3"
                                :to="`/heroes/${previous.id}`"
                                :aria-label="`Previous hero, ${previous.name}`"
                            >
                                <Icon
                                    name="lucide:arrow-left"
                                    class="size-4"
                                />
                                <span class="hidden sm:inline">{{ previous.name }}</span>
                            </UiButton>
                            <UiButton
                                v-if="next"
                                variant="outline"
                                size="sm"
                                class="px-2.5 sm:px-3"
                                :to="`/heroes/${next.id}`"
                                :aria-label="`Next hero, ${next.name}`"
                            >
                                <span class="hidden sm:inline">{{ next.name }}</span>
                                <Icon
                                    name="lucide:arrow-right"
                                    class="size-4"
                                />
                            </UiButton>
                        </div>
                    </div>

                    <div class="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                        <span
                            v-if="hero.class"
                            class="inline-flex items-center gap-2.5 text-sm font-medium"
                            :class="classTint(hero.class)"
                        >
                            <img
                                v-if="assetPath(hero.classIcon)"
                                :src="assetPath(hero.classIcon)"
                                alt=""
                                class="size-9 object-contain"
                            >
                            {{ hero.class }}
                        </span>
                        <span
                            v-if="hero.faction"
                            class="inline-flex items-center gap-2.5 text-sm font-medium"
                        >
                            <UiTooltip v-if="assetPath(hero.factionIcon)">
                                <UiTooltipTrigger as-child>
                                    <button
                                        type="button"
                                        :aria-label="`${hero.faction}. ${hero.factionAdvantage}`"
                                    >
                                        <img
                                            :src="assetPath(hero.factionIcon)"
                                            :alt="hero.faction"
                                            class="size-9 rounded-full object-contain"
                                        >
                                    </button>
                                </UiTooltipTrigger>
                                <UiTooltipContent class="max-w-56 text-left">
                                    <p class="text-sm font-medium">{{ hero.faction }}</p>
                                    <p class="text-muted-foreground mt-1 text-xs leading-relaxed">{{ hero.factionAdvantage }}</p>
                                </UiTooltipContent>
                            </UiTooltip>
                            {{ hero.faction }}
                        </span>
                        <UiBadge
                            v-if="hero.role"
                            variant="outline"
                        >
                            {{ hero.role }}
                        </UiBadge>
                        <UiBadge
                            v-if="hero.secondaryRole"
                            variant="outline"
                        >
                            {{ hero.secondaryRole }}
                        </UiBadge>
                    </div>
                    <p
                        v-if="hero.description"
                        class="mt-4 max-w-xl text-base leading-7 text-pretty"
                    >
                        {{ hero.description }}
                    </p>
                </div>

                <div class="order-4 lg:order-0">
                    <UiTabs
                        :key="hero.id"
                        default-value="skills"
                        class="mt-0 lg:mt-8"
                    >
                        <UiTabsList class="h-auto w-full flex-wrap justify-start">
                            <UiTabsTrigger value="skills">
                                Skills
                            </UiTabsTrigger>
                            <UiTabsTrigger
                                v-if="hero.stats?.stats.length"
                                value="stats"
                            >
                                Stats
                            </UiTabsTrigger>
                            <UiTabsTrigger
                                v-if="hasRecommended"
                                value="recommended"
                            >
                                Recommended
                            </UiTabsTrigger>
                            <UiTabsTrigger
                                v-if="hero.lines?.length"
                                value="lines"
                            >
                                Lines
                            </UiTabsTrigger>
                            <UiTabsTrigger
                                v-if="hero.skins?.length"
                                value="skins"
                            >
                                Skins
                            </UiTabsTrigger>
                        </UiTabsList>

                        <UiTabsContent
                            value="skills"
                            class="mt-4"
                        >
                            <UiTabs
                                v-if="skills.length"
                                :key="`skills-${hero.id}`"
                                :default-value="String(skills[0]?.id)"
                            >
                                <UiTabsList class="h-auto w-full flex-wrap justify-start gap-1">
                                    <UiTabsTrigger
                                        v-for="skill in skills"
                                        :key="skill.id"
                                        :value="String(skill.id)"
                                        class="gap-1.5 px-2"
                                    >
                                        <img
                                            v-if="skillIcon(skill)"
                                            :src="skillIcon(skill)"
                                            alt=""
                                            class="size-5 rounded-sm object-contain"
                                        >
                                        <span class="max-w-28 truncate">{{ skill.name }}</span>
                                        <UiBadge
                                            v-if="skill.core"
                                            variant="soft"
                                            color="primary"
                                            class="px-1.5 py-0 text-[10px]"
                                        >
                                            Core
                                        </UiBadge>
                                    </UiTabsTrigger>
                                </UiTabsList>
                                <UiTabsContent
                                    v-for="skill in skills"
                                    :key="skill.id"
                                    :value="String(skill.id)"
                                    class="bg-card mt-3 rounded-xl border"
                                >
                                    <div class="flex gap-3 px-4 py-3">
                                        <img
                                            v-if="skillIcon(skill)"
                                            :src="skillIcon(skill)"
                                            alt=""
                                            class="bg-muted size-11 shrink-0 rounded-md object-contain"
                                        >
                                        <div class="min-w-0 flex-1">
                                            <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
                                                <p class="font-medium">
                                                    {{ skill.name }}
                                                </p>
                                                <UiBadge
                                                    v-if="skill.core"
                                                    variant="soft"
                                                    color="primary"
                                                >
                                                    Core
                                                </UiBadge>
                                            </div>
                                            <p
                                                v-if="baseRank(skill)"
                                                class="mt-1 text-sm leading-relaxed"
                                            >
                                                <SkillText :text="baseRank(skill)?.description ?? ''" />
                                            </p>
                                        </div>
                                    </div>
                                    <ol
                                        v-if="laterRanks(skill).length"
                                        class="divide-y border-t"
                                    >
                                        <li
                                            v-for="rank in laterRanks(skill)"
                                            :key="rank.level"
                                            class="grid grid-cols-[2.75rem_1fr] gap-3 px-4 py-3"
                                        >
                                            <span class="text-muted-foreground pt-0.5 text-xs font-medium tabular-nums">
                                                Lv.{{ rank.level }}
                                            </span>
                                            <p class="text-sm leading-relaxed">
                                                <SkillText :text="rank.description" />
                                            </p>
                                        </li>
                                    </ol>
                                </UiTabsContent>
                            </UiTabs>
                            <UiEmpty v-else>
                                <UiEmptyHeader>
                                    <UiEmptyMedia>
                                        <Icon
                                            name="lucide:sparkles"
                                            class="text-muted-foreground size-6"
                                        />
                                    </UiEmptyMedia>
                                    <UiEmptyTitle>No skills recorded</UiEmptyTitle>
                                    <UiEmptyDescription>This hero has no skills.</UiEmptyDescription>
                                </UiEmptyHeader>
                            </UiEmpty>
                        </UiTabsContent>

                        <UiTabsContent
                            v-if="hero.stats"
                            value="stats"
                            class="bg-card mt-4 rounded-xl border p-4"
                        >
                            <div class="flex items-baseline justify-between gap-3">
                                <p class="text-sm font-medium">
                                    Level {{ level }}
                                </p>
                                <p class="text-muted-foreground text-xs">
                                    Before gear
                                </p>
                            </div>
                            <div class="mt-3 flex items-center gap-3">
                                <input
                                    v-model.number="level"
                                    type="range"
                                    min="1"
                                    :max="hero.stats.maxLevel"
                                    class="accent-primary h-1.5 w-full"
                                    aria-label="Stat level"
                                >
                                <input
                                    v-model.number="level"
                                    type="number"
                                    min="1"
                                    :max="hero.stats.maxLevel"
                                    class="border-input bg-background h-8 w-16 rounded-md border text-center text-sm tabular-nums"
                                    aria-label="Stat level number"
                                >
                            </div>
                            <p
                                v-if="promotionLine"
                                class="text-muted-foreground mt-3 text-xs"
                            >
                                Attribute promotion {{ promotionLine }}
                            </p>
                            <ul class="mt-4 grid gap-x-8 sm:grid-cols-2">
                                <li
                                    v-for="stat in hero.stats.stats"
                                    :key="stat.name"
                                    class="flex items-baseline justify-between gap-3 border-b py-2"
                                >
                                    <span class="text-muted-foreground text-sm">{{ stat.name }}</span>
                                    <span class="text-right">
                                        <span class="font-semibold tabular-nums">{{ formatStat(statAt(stat, level)) }}</span>
                                        <span
                                            v-if="stat.growth"
                                            class="text-muted-foreground ml-2 text-xs tabular-nums"
                                        >
                                            +{{ formatStat(growthAt(stat)) }}/lv
                                        </span>
                                    </span>
                                </li>
                            </ul>
                            <p class="text-muted-foreground mt-2 text-xs leading-relaxed">
                                Armor PEN, Crit, Crit DMG, and the other combat rates are not on the hero. Gear adds them.
                            </p>
                        </UiTabsContent>

                        <UiTabsContent
                            v-if="hasRecommended"
                            value="recommended"
                            class="mt-4 space-y-8"
                        >
                            <section v-if="pickedTalents.length">
                                <h3 class="text-sm font-medium">
                                    Talents
                                </h3>
                                <ul class="mt-3 grid gap-3 sm:grid-cols-2">
                                    <li
                                        v-for="talent in pickedTalents"
                                        :key="talent.choice.id"
                                        class="bg-card flex gap-3 rounded-xl border px-3 py-2"
                                    >
                                        <img
                                            v-if="talent.choice.icon"
                                            :src="assetPath(talent.choice.icon)"
                                            alt=""
                                            class="bg-muted size-10 shrink-0 rounded-md object-contain"
                                        >
                                        <div class="min-w-0">
                                            <p class="text-muted-foreground text-[11px] font-medium tracking-[0.14em] uppercase">
                                                {{ talent.name }}
                                            </p>
                                            <p class="text-sm font-medium">
                                                {{ talent.choice.name }}
                                            </p>
                                            <p
                                                v-if="talent.choice.description"
                                                class="text-muted-foreground mt-1 text-xs leading-relaxed"
                                            >
                                                <SkillText :text="talent.choice.description" />
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </section>
                            <section v-if="hero.recommended?.artifacts.length">
                                <h3 class="text-sm font-medium">
                                    Artifacts
                                </h3>
                                <ul class="mt-3 grid gap-3 sm:grid-cols-2">
                                    <li
                                        v-for="piece in hero.recommended.artifacts"
                                        :key="piece.name"
                                        class="bg-card flex gap-3 rounded-xl border px-3 py-3"
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
                                                v-if="piece.description"
                                                class="text-muted-foreground mt-1 text-xs leading-relaxed"
                                            >
                                                <SkillText :text="piece.description" />
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </section>
                            <section v-if="hero.recommended?.stats.length">
                                <h3 class="text-sm font-medium">
                                    Stats to stack
                                </h3>
                                <ul class="mt-3 flex flex-wrap gap-2">
                                    <li
                                        v-for="stat in hero.recommended.stats"
                                        :key="stat"
                                    >
                                        <UiBadge variant="outline">
                                            {{ stat }}
                                        </UiBadge>
                                    </li>
                                </ul>
                            </section>
                            <section v-if="hero.recommended?.sigils.length">
                                <h3 class="text-sm font-medium">
                                    Origems
                                </h3>
                                <ul class="mt-3 flex flex-wrap gap-3">
                                    <li
                                        v-for="piece in hero.recommended.sigils"
                                        :key="piece.name"
                                        class="bg-card flex items-center gap-2.5 rounded-xl border px-3 py-2"
                                    >
                                        <OrigemMark
                                            v-if="piece.icon"
                                            :src="assetPath(piece.icon)"
                                        />
                                        <p class="text-sm font-medium">
                                            {{ piece.name }}
                                        </p>
                                    </li>
                                </ul>
                            </section>
                        </UiTabsContent>

                        <UiTabsContent
                            v-if="hero.lines?.length"
                            value="lines"
                            class="mt-4"
                        >
                            <ul class="space-y-3">
                                <li
                                    v-for="(line, index) in hero.lines"
                                    :key="`${line.label}-${index}`"
                                    class="bg-card rounded-xl border px-4 py-3"
                                >
                                    <p class="text-muted-foreground text-[11px] font-medium tracking-[0.14em] uppercase">
                                        {{ line.label }}
                                    </p>
                                    <p class="mt-1 text-sm leading-relaxed">
                                        “{{ line.text }}”
                                    </p>
                                </li>
                            </ul>
                        </UiTabsContent>

                        <UiTabsContent
                            v-if="hero.skins?.length"
                            value="skins"
                            class="mt-4"
                        >
                            <ul class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
                                <li
                                    v-for="skin in skinsByGrade"
                                    :key="skin.id"
                                >
                                    <SkinCard
                                        :name="skin.name"
                                        :grade="skin.grade"
                                        :portrait="skin.portrait"
                                        :bonuses="skin.bonuses"
                                        :global-bonus="skin.global"
                                        :selected="selectedSkinId === skin.id"
                                        @select="pickSkin(skin.id)"
                                    />
                                </li>
                            </ul>
                        </UiTabsContent>
                    </UiTabs>
                </div>
            </div>
        </div>
    </UiContainer>
</template>

<script lang="ts" setup>
const route = useRoute()
const { heroes, byId, levelGrades, talents } = useHeroes()
const DEFAULT_LEVEL = 340

const hero = computed(() => byId.get(Number(route.params.id)))
const skills = computed(() => hero.value?.skills.filter(skill => !skill.awakening) ?? [])
const awakening = computed(() => hero.value?.skills.find(skill => skill.awakening))
const level = ref(DEFAULT_LEVEL)
const playing = ref(false)
let voice: HTMLAudioElement | null = null
let lastVoice = ''

function stopVoice () {
    voice?.pause()
    voice = null
    playing.value = false
}

function playVoice () {
    const files = hero.value?.voices ?? []
    if (!files.length) { return }
    stopVoice()
    const pool = files.length > 1 ? files.filter(file => file !== lastVoice) : files
    const pick = pool[Math.floor(Math.random() * pool.length)] ?? files[0]
    lastVoice = pick
    const next = new Audio(assetPath(pick))
    voice = next
    playing.value = true
    next.onended = () => {
        if (voice === next) { playing.value = false }
    }
    void next.play()
}

function gradeAt (current: number) {
    let grade = 0
    for (const step of levelGrades) {
        if (step.level <= current) { grade = step.grade } else { break }
    }
    return grade
}

const recommendedTalents = computed(() => new Set(hero.value?.recommendedTalents ?? []))

const pickedTalents = computed(() =>
    talents.flatMap((tier) => {
        const choice = tier.skills.find(skill => recommendedTalents.value.has(skill.id))
        return choice ? [ { name: tier.name, choice } ] : []
    }),
)

const hasRecommended = computed(() =>
    pickedTalents.value.length > 0
    || (hero.value?.recommended?.stats.length ?? 0) > 0
    || (hero.value?.recommended?.artifacts.length ?? 0) > 0
    || (hero.value?.recommended?.sigils.length ?? 0) > 0,
)

const promotion = computed(() => {
    const grade = gradeAt(level.value)
    return hero.value?.stats?.promotions.find(item => item.grade === grade)
})

const promotionLine = computed(() =>
    (hero.value?.stats?.stats ?? [])
        .flatMap((stat) => {
            const percent = promotion.value?.[stat.key]
            return percent ? [`${stat.name} +${percent}%`] : []
        })
        .join(' · '),
)

function promotionPercent (stat: { key: 'hp' | 'atk' | 'armor' | 'speed' }) {
    return promotion.value?.[stat.key] ?? 0
}

function statAt (stat: { key: 'hp' | 'atk' | 'armor' | 'speed', base: number, growth: number }, current: number) {
    return (stat.base + stat.growth * (current - 1)) * (1 + promotionPercent(stat) / 100)
}

function growthAt (stat: { key: 'hp' | 'atk' | 'armor' | 'speed', growth: number }) {
    return stat.growth * (1 + promotionPercent(stat) / 100)
}

function formatStat (value: number) {
    const rounded = Math.round(value * 10) / 10
    const [ whole, fraction ] = (Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)).split('.')
    const grouped = Number(whole).toLocaleString('en-US')
    return fraction ? `${grouped}.${fraction}` : grouped
}

watch(level, (value) => {
    const max = hero.value?.stats?.maxLevel ?? 1
    if (!Number.isFinite(value) || value < 1) { level.value = 1 } else if (value > max) { level.value = max }
})

function resetLevel () {
    const max = hero.value?.stats?.maxLevel ?? 1
    level.value = Math.min(DEFAULT_LEVEL, max)
}

watch(
    () => hero.value?.id,
    () => {
        resetLevel()
        stopVoice()
    },
)

onBeforeUnmount(stopVoice)

function baseRank (skill: (typeof skills.value)[number]) {
    return skill.levels.find(rank => rank.level === 1)
}

function laterRanks (skill: (typeof skills.value)[number]) {
    return baseRank(skill) ? skill.levels.filter(rank => rank.level !== 1) : skill.levels
}

function exclusiveHeading (label: string) {
    return label.replaceAll('【', '').replaceAll('】', '').trim()
}

const ordered = computed(() => [...heroes].sort((left, right) => left.name.localeCompare(right.name)))
const index = computed(() => ordered.value.findIndex(item => item.id === hero.value?.id))
const previous = computed(() => (index.value > 0 ? ordered.value[index.value - 1] : undefined))
const next = computed(() => ordered.value[index.value + 1])
const skinsByGrade = computed(() =>
    [...(hero.value?.skins ?? [])].sort(
        (left, right) => left.gradeId - right.gradeId || left.name.localeCompare(right.name),
    ),
)
const selectedSkinId = ref<number | null>(null)
const selectedSkin = computed(() => hero.value?.skins?.find(skin => skin.id === selectedSkinId.value))
const portraitSrc = computed(() =>
    selectedSkin.value ? assetPath(selectedSkin.value.portrait) : hero.value ? heroArt(hero.value) : '',
)
const portraitAlt = computed(() =>
    selectedSkin.value ? `Portrait of ${selectedSkin.value.name}` : `Portrait of ${hero.value?.name ?? 'hero'}`,
)

function pickSkin (id: number) {
    selectedSkinId.value = selectedSkinId.value === id ? null : id
}

watch(
    () => hero.value?.id,
    () => {
        selectedSkinId.value = null
    },
)

watch(hero, (value) => {
    if (!value) {
        throw createError({ statusCode: 404, statusMessage: 'Hero not found' })
    }
}, { immediate: true })

useSeoMeta({
    title: computed(() => hero.value ? `${hero.value.name} · Titan War Wiki` : 'Hero · Titan War Wiki'),
    description: computed(() =>
        [ hero.value?.title, hero.value?.class, hero.value?.rarity ].filter(Boolean).join(' · '),
    ),
})
</script>
