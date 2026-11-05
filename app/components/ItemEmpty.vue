<template>
    <UiEmpty class="mt-6">
        <UiEmptyHeader>
            <UiEmptyMedia>
                <Icon
                    name="lucide:shield"
                    class="text-muted-foreground size-6"
                />
            </UiEmptyMedia>
            <UiEmptyTitle>No items match</UiEmptyTitle>
            <UiEmptyDescription>Try another name, or clear the search.</UiEmptyDescription>
        </UiEmptyHeader>
        <UiEmptyContent>
            <UiButton
                variant="outline"
                @click="emit('clear')"
            >
                Clear search
            </UiButton>
        </UiEmptyContent>
    </UiEmpty>
</template>

<script lang="ts" setup>
const emit = defineEmits<{ clear: [] }>()
</script>
