import catalog from '~/data/items.json'

export type ItemStat = {
    name: string
    value: string
}

export type ArmorPiece = {
    id: number
    name: string
    set: string
    slot: string
    grade: number
    icon: string
    stats: ItemStat[]
}

export type OrigemBonus = {
    level: string
    requirement: string
    count: number
    text: string
}

export type OrigemSet = {
    name: string
    description: string
    icon: string
    bonuses: OrigemBonus[]
}

export type ArtifactEffect = {
    level: number
    label: string
    description: string
}

export type ArtifactItem = {
    id: number
    name: string
    set: string
    description: string
    icon: string
    art: string
    level: number
    stats: ItemStat[]
    echoTitle: string
    echo: ItemStat[]
    effects: ArtifactEffect[]
    info: string
}

export const armors = catalog.armors as ArmorPiece[]
export const origems = catalog.origems as OrigemSet[]
export const artifacts = catalog.artifacts as ArtifactItem[]
export const origemNote = catalog.origemNote as string

export function useItems () {
    return { armors, origems, artifacts, origemNote }
}
