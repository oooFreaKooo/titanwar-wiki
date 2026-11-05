<template>
    <div class="flex items-center justify-center px-4 py-12 sm:px-6">
        <div class="flex w-full max-w-md flex-col items-center text-center">
            <div class="relative w-full max-w-xs">
                <div
                    class="space-y-2.5 opacity-70 mask-[linear-gradient(to_bottom,black_20%,transparent)]"
                    aria-hidden="true"
                >
                    <div
                        v-for="row in 4"
                        :key="row"
                        class="bg-card flex items-center gap-3 rounded-lg border p-3 shadow-xs"
                    >
                        <div class="bg-muted size-9 shrink-0 rounded-full" />
                        <div class="flex-1 space-y-2">
                            <div
                                class="bg-muted h-2.5 rounded-full"
                                :style="{ width: `${85 - row * 12}%` }"
                            />
                            <div class="bg-muted/70 h-2 w-1/2 rounded-full" />
                        </div>
                    </div>
                </div>
                <div class="absolute inset-x-0 bottom-0 flex translate-y-1/2 justify-center">
                    <div class="bg-background flex size-16 items-center justify-center rounded-full border shadow-md">
                        <Icon
                            name="lucide:search-x"
                            class="text-muted-foreground size-7"
                        />
                    </div>
                </div>
            </div>

            <div class="mt-14 flex flex-col gap-2">
                <h2 class="text-xl">
                    No heroes found
                </h2>
                <p class="text-muted-foreground text-sm text-balance">
                    Nothing matches this search and these filters. Try a name, a subtitle, or a broader class.
                </p>
            </div>

            <div class="mt-5 flex flex-wrap justify-center gap-2">
                <span class="text-muted-foreground self-center text-xs">Try</span>
                <button
                    v-for="term in suggestions"
                    :key="term"
                    type="button"
                    class="bg-muted hover:bg-accent rounded-full px-3 py-1 text-xs font-medium transition-colors"
                    @click="emit('pick', term)"
                >
                    {{ term }}
                </button>
            </div>

            <div class="mt-7">
                <UiButton
                    variant="outline"
                    @click="emit('clear')"
                >
                    <Icon
                        name="lucide:rotate-ccw"
                        class="size-4"
                    />
                    Clear filters
                </UiButton>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{ suggestions?: string[] }>(), {
    suggestions: () => [
        'Lady Bee', 'Shadow Dragon', 'Fashionista', 'Agent Zero',
    ],
})

const emit = defineEmits<{
    pick: [term: string]
    clear: []
}>()
</script>
