<template>
    <div class="bg-background text-foreground flex min-h-svh flex-col overflow-x-clip">
        <WikiHeader />
        <main class="flex-1">
            <slot />
        </main>
        <footer class="text-muted-foreground border-t px-4 py-8 text-center text-sm">
            A fan wiki for Titan War.
        </footer>
        <HeroCommand />
    </div>
</template>
