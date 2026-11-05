import catalog from '~/data/heroes.json'

export type HeroSkillRank = {
    level: number
    description: string
}

export type HeroSkill = {
    id: number
    name: string
    levels: HeroSkillRank[]
    description: string
    icon: string
    core: boolean
    awakening: boolean
}

export type HeroExclusiveStat = {
    name: string
    value: string
}

export type HeroExclusiveUnlock = {
    level: number
    description: string
}

export type HeroExclusive = {
    id: number
    name: string
    icon: string
    level: number
    label: string
    stats: HeroExclusiveStat[]
    skillName: string
    skillIcon: string
    description: string
    unlocks: HeroExclusiveUnlock[]
}

export type HeroSkinStat = {
    name: string
    value: string
}

export type HeroSkin = {
    id: number
    name: string
    grade: string
    gradeId: number
    portrait: string
    heroId: number
    heroName: string
    bonuses: HeroSkinStat[]
    global: HeroSkinStat[]
}

export type HeroGrowthStat = {
    key: 'hp' | 'atk' | 'armor' | 'speed'
    name: string
    base: number
    growth: number
}

export type HeroPromotion = {
    grade: number
    hp?: number
    atk?: number
    armor?: number
    speed?: number
}

export type HeroTalentChoice = {
    id: number
    name: string
    description: string
    icon: string
}

export type HeroTalent = {
    name: string
    skills: HeroTalentChoice[]
}

export type HeroStats = {
    maxLevel: number
    skillPoints: number | null
    stats: HeroGrowthStat[]
    promotions: HeroPromotion[]
}

export type LevelGrade = {
    level: number
    grade: number
}

export type RecommendedPiece = {
    name: string
    icon: string
    description?: string
}

export type HeroRecommended = {
    stats: string[]
    artifacts: RecommendedPiece[]
    sigils: RecommendedPiece[]
}

export type HeroLine = {
    label: string
    text: string
}

export type Hero = {
    id: number
    name: string
    title: string
    description: string
    class: string
    classId: number | null
    rarity: string
    rarityId: number | null
    starLevel: number | null
    role: string
    secondaryRole: string
    faction: string
    factionId: number | null
    factionAdvantage: string
    factionIcon: string
    classIcon: string
    portrait: string
    illustration: string
    skills: HeroSkill[]
    skins: HeroSkin[]
    exclusive: HeroExclusive | null
    stats: HeroStats | null
    lines: HeroLine[]
    voices: string[]
    recommendedTalents: number[]
    recommended: HeroRecommended
    variantIds: number[]
}

const heroes = catalog.heroes as Hero[]
export const levelGrades = (catalog.levelGrades ?? []) as LevelGrade[]
export const talents = (catalog.talents ?? []) as HeroTalent[]
const byId = new Map(heroes.map(hero => [ hero.id, hero ]))

export const heroClasses = [...new Set(heroes.map(hero => hero.class).filter(Boolean))].sort(
    (left, right) => classOrder(left) - classOrder(right),
)

export const heroRarities = [
    'S+', 'S', 'A', 'B',
].filter(rarity =>
    heroes.some(hero => hero.rarity === rarity),
)

export const heroRoles = [...new Set(heroes.map(hero => hero.role).filter(Boolean))].sort()

export const heroFactions = [
    ...new Map(
        heroes
            .filter(hero => hero.faction)
            .sort((left, right) => (left.factionId ?? 0) - (right.factionId ?? 0))
            .map(hero => [ hero.faction, hero ]),
    ).values(),
]

export function skinStatLine (stats: HeroSkinStat[] | undefined) {
    return (stats ?? []).map(stat => `${stat.name} ${stat.value}`).join(' · ')
}

// Public files keep a leading slash locally. GitHub Pages serves the site under /titanwar-wiki/.
function withBase (path: string) {
    if (!path) { return '' }
    const base = useRuntimeConfig().app.baseURL || '/'
    return `${base}${path.replace(/^\/+/, '')}`
}

export function assetPath (path: string) {
    return withBase(path)
}

export function heroPortrait (hero: Pick<Hero, 'portrait'>) {
    return withBase(hero.portrait)
}

export function skillIcon (skill: Pick<HeroSkill, 'icon'>) {
    return withBase(skill.icon)
}

export function heroArt (hero: Pick<Hero, 'portrait' | 'illustration'>) {
    return withBase(hero.illustration || hero.portrait)
}

const rarityFiles: Record<string, string> = {
    'B': 'B.png',
    'A': 'A.png',
    'S': 'S.png',
    'S+': 'splus.png',
}

// Portrait section titles: 4150 Ordinary Heroes (B) through 4153 Mythic Heroes (S+).
const rarityNames: Record<string, string> = {
    'B': 'Ordinary',
    'A': 'Legendary',
    'S': 'Mythic',
    'S+': 'Mythic +',
}

export function rarityName (rarity: string) {
    return rarityNames[rarity] ?? rarity
}

export function rarityIcon (rarity: string) {
    const file = rarityFiles[rarity]
    return file ? withBase(`images/rarity/${file}`) : ''
}

const classTints: Record<string, string> = {
    Warrior: 'text-rose-300',
    Mage: 'text-violet-300',
    Ranger: 'text-emerald-300',
    Assassin: 'text-fuchsia-300',
    Healer: 'text-sky-300',
}

export function classTint (name: string) {
    return classTints[name] ?? 'text-muted-foreground'
}

const skinGradeTints: Record<string, string> = {
    Excellent: 'text-sky-700 dark:text-sky-300',
    Epic: 'text-violet-700 dark:text-violet-300',
    Legendary: 'text-amber-800 dark:text-amber-300',
    Mythic: 'text-rose-700 dark:text-rose-300',
    Rare: 'text-emerald-700 dark:text-emerald-300',
}

export function skinGradeTint (grade: string) {
    return skinGradeTints[grade] ?? 'text-muted-foreground'
}

export const skinGradeOrder = [
    'Legendary', 'Epic', 'Excellent', 'Mythic', 'Rare',
]

export function rarityColor (rarity: string) {
    switch (rarity) {
        case 'S+':
            return 'rose'
        case 'S':
            return 'amber'
        case 'A':
            return 'violet'
        case 'B':
            return 'sky'
        default:
            return 'zinc'
    }
}

function classOrder (name: string) {
    const hero = heroes.find(item => item.class === name)
    return hero?.classId ?? 99
}

export function useHeroes () {
    return {
        heroes,
        byId,
        count: heroes.length,
        levelGrades,
        talents,
    }
}

export function useHeroSearch () {
    const open = useState('hero-search-open', () => false)
    return { open }
}
