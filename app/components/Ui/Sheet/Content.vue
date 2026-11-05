<template>
    <UiSheetPortal :to="to">
        <slot name="overlay">
            <UiSheetOverlay :is-blurred />
        </slot>
        <DialogContent
            data-slot="sheet-content"
            :class="
                styles({
                    side,
                    isBlurred,
                    variant,
                    fullscreen,
                    translucent: props.translucent,
                    class: normalizeClass(props.class) || undefined,
                })
            "
            v-bind="{ ...forwarded, ...$attrs }"
            @interact-outside="onInteractOutside"
        >
            <slot>
                <slot name="header">
                    <UiSheetHeader>
                        <slot name="title">
                            <UiSheetTitle
                                v-if="title"
                                :title="title"
                            />
                        </slot>
                        <slot name="description">
                            <UiSheetDescription
                                v-if="description"
                                :description="description"
                            />
                        </slot>
                    </UiSheetHeader>
                </slot>
                <slot name="content" />
                <slot name="footer" />
            </slot>
            <slot name="close">
                <UiSheetX :icon="icon" />
            </slot>
        </DialogContent>
    </UiSheetPortal>
</template>

<script lang="ts" setup>
import { DialogContent, useForwardPropsEmits } from 'reka-ui'
import type { DialogContentEmits, DialogContentProps } from 'reka-ui'
import { normalizeClass } from 'vue'
import type { HTMLAttributes } from 'vue'

defineOptions({ inheritAttrs: false })

function onInteractOutside (event: Event) {
    const target = (event as CustomEvent).detail?.originalEvent?.target as HTMLElement | null
    if (target?.closest?.('[data-sonner-toaster]')) { event.preventDefault() }
}

const styles = tv({
    base: 'bg-background data-[state=closed]:animate-out data-[state=open]:animate-in fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
    variants: {
        side: {
            top: 'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b',
            bottom:
          'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t',
            left: 'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
            right:
          'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
        },
        isBlurred: {
            true: 'backdrop-blur-sm',
            false: 'backdrop-blur-none',
        },
        variant: {
            default: '',
            floating: 'rounded-lg border',
        },
        translucent: {
            true: getTranslucentFloatingPanelClasses('background'),
        },
        fullscreen: {
            true: 'inset-0 m-0 size-full rounded-none border-0',
            false: '',
        },
    },
    compoundVariants: [
        { side: 'top', variant: 'floating', class: 'inset-x-4 top-4' },
        { side: 'bottom', variant: 'floating', class: 'inset-x-4 bottom-4' },
        { side: 'left', variant: 'floating', class: 'inset-y-4 left-4 h-[calc(100%-2rem)]' },
        { side: 'right', variant: 'floating', class: 'inset-y-4 right-4 h-[calc(100%-2rem)]' },
        { fullscreen: true, side: 'left', class: 'w-full max-w-none sm:max-w-none' },
        { fullscreen: true, side: 'right', class: 'w-full max-w-none sm:max-w-none' },
        {
            fullscreen: true,
            variant: 'floating',
            class:
          'inset-4 h-[calc(100%-2rem)] max-h-none w-[calc(100%-2rem)] max-w-full rounded-xl border sm:max-h-none sm:max-w-full',
        },
    ],
    defaultVariants: {
        side: 'left',
        variant: 'default',
        fullscreen: false,
    },
})

const props = withDefaults(
    defineProps<
      DialogContentProps & {
          icon?: string
          title?: string
          description?: string
          class?: HTMLAttributes['class']
          side?: VariantProps<typeof styles>['side']
          variant?: VariantProps<typeof styles>['variant']
          fullscreen?: VariantProps<typeof styles>['fullscreen']
          to?: string | HTMLElement
          isBlurred?: boolean
          translucent?: boolean
      }
    >(),
    { isBlurred: true },
)
const emits = defineEmits<DialogContentEmits>()
const forwarded = useForwardPropsEmits(
    reactiveOmit(props, [
        'class',
        'icon',
        'title',
        'description',
        'to',
        'side',
        'variant',
        'fullscreen',
        'isBlurred',
        'translucent',
    ]),
    emits,
)
</script>
