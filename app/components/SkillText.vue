<template>
    <span class="whitespace-pre-line">
        <template
            v-for="(part, index) in segments"
            :key="index"
        >
            <span
                v-if="part.tone"
                :class="part.tone"
            >{{ part.text }}</span>
            <template v-else>{{ part.text }}</template>
        </template>
    </span>
</template>

<script lang="ts" setup>
const props = defineProps<{ text: string }>()

type Part = { text: string, tone?: string }

const COLOR = /<color=(#[0-9A-Fa-f]{3,8}|[A-Za-z]+)>|<\/color>/gi
const NUMBER = /\d[\d,]*(?:\.\d+)?%?/g
const LEVEL = /^\s*Lv\.?\s*\d+\s*:\s*/

function toneFor (color: string) {
    const hex = color.replace('#', '').slice(0, 6)
    const value = Number.parseInt(hex, 16)
    if (!Number.isFinite(value) || hex.length !== 6) { return 'font-medium text-lime-700 dark:text-[#bcf293]' }
    const red = (value >> 16) & 255
    const green = (value >> 8) & 255
    const blue = value & 255
    if (red > green + 40 && red > blue) { return 'font-medium text-rose-700 dark:text-rose-300' }
    if (blue > red + 20 && blue > green) { return 'font-medium text-sky-700 dark:text-sky-300' }
    if (red > 170 && green > 140 && blue < 120) { return 'font-medium text-amber-700 dark:text-amber-300' }
    return 'font-medium text-lime-700 dark:text-[#bcf293]'
}

function parts (source: string): Part[] {
    const marked: { text: string, color?: string }[] = []
    const stack: string[] = []
    let last = 0
    let hasColor = false
    for (const match of source.matchAll(COLOR)) {
        const index = match.index ?? 0
        const chunk = source.slice(last, index)
        if (chunk) { marked.push({ text: chunk, color: stack.at(-1) }) }
        if (match[0].toLowerCase() === '</color>') { stack.pop() } else {
            hasColor = true
            stack.push(match[1] ?? '')
        }
        last = index + match[0].length
    }
    const tail = source.slice(last)
    if (tail) { marked.push({ text: tail, color: stack.at(-1) }) }

    const out: Part[] = []
    for (const piece of marked) {
        if (piece.color) {
            out.push({ text: piece.text, tone: toneFor(piece.color) })
            continue
        }
        if (hasColor) {
            out.push({ text: piece.text })
            continue
        }
        let cursor = 0
        for (const num of piece.text.matchAll(NUMBER)) {
            const index = num.index ?? 0
            if (index > cursor) { out.push({ text: piece.text.slice(cursor, index) }) }
            out.push({ text: num[0], tone: toneFor('#bcf293') })
            cursor = index + num[0].length
        }
        if (cursor < piece.text.length) { out.push({ text: piece.text.slice(cursor) }) }
    }
    return out
}

const segments = computed(() => parts(props.text.replace(LEVEL, '')))
</script>
