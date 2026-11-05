<template>
    <UiDropdownMenu @update:open="onOpen">
        <UiDropdownMenuTrigger as-child>
            <UiButton
                variant="outline"
                class="h-9 gap-2 px-2.5"
                :class="active && 'border-primary/40 bg-accent/50'"
                :aria-label="`${label} filter, ${currentLabel}`"
            >
                <Icon
                    :name="icon"
                    class="text-muted-foreground size-4"
                />
                <span>{{ label }}</span>
                <span
                    v-if="active || alwaysShowValue"
                    class="font-medium"
                >{{ currentLabel }}</span>
                <Icon
                    name="lucide:chevron-down"
                    class="text-muted-foreground size-3.5"
                />
            </UiButton>
        </UiDropdownMenuTrigger>
        <UiDropdownMenuContent
            align="start"
            class="w-56"
        >
            <UiDropdownMenuLabel :label="label" />
            <UiDropdownMenuFilter
                v-if="searchable"
                v-model="search"
                auto-focus
                :aria-label="`Search ${label.toLowerCase()}`"
                :placeholder="`Search ${label.toLowerCase()}`"
            />
            <UiDropdownMenuSeparator v-else />
            <UiDropdownMenuRadioGroup v-model="model">
                <UiDropdownMenuRadioItem
                    v-if="!hideAll"
                    :value="allValue"
                    :text-value="allLabel"
                    :title="allLabel"
                />
                <UiDropdownMenuRadioItem
                    v-for="option in filtered"
                    :key="option.value"
                    :value="option.value"
                    :text-value="option.label"
                >
                    <img
                        v-if="option.image"
                        :src="option.image"
                        alt=""
                        class="size-5 shrink-0 object-contain"
                    >
                    <Icon
                        v-else-if="option.icon"
                        :name="option.icon"
                        class="size-4 opacity-70"
                    />
                    <span>{{ option.label }}</span>
                </UiDropdownMenuRadioItem>
            </UiDropdownMenuRadioGroup>
            <p
                v-if="search && !filtered.length"
                class="text-muted-foreground px-2 py-3 text-center text-sm"
            >
                No matches.
            </p>
        </UiDropdownMenuContent>
    </UiDropdownMenu>
</template>

<script lang="ts" setup>
import { useFilter } from 'reka-ui'

export type FilterOption = {
    value: string
    label: string
    icon?: string
    image?: string
}

const props = withDefaults(
    defineProps<{
        label: string
        icon: string
        options: FilterOption[]
        allValue?: string
        allLabel?: string
        searchable?: boolean
        hideAll?: boolean
        alwaysShowValue?: boolean
    }>(),
    {
        allValue: 'All',
        allLabel: 'Any',
        searchable: false,
        hideAll: false,
        alwaysShowValue: false,
    },
)

const model = defineModel<string>({ required: true })
const search = ref('')
const { contains } = useFilter({ sensitivity: 'base' })

const currentLabel = computed(
    () => props.options.find(option => option.value === model.value)?.label ?? props.allLabel,
)
const active = computed(() => model.value !== props.allValue)
const filtered = computed(() =>
    props.searchable && search.value
        ? props.options.filter(option => contains(option.label, search.value))
        : props.options,
)

function onOpen (open: boolean) {
    if (!open) { search.value = '' }
}
</script>
