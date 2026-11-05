<template>
    <div class="bg-background text-foreground flex min-h-svh flex-col overflow-x-clip">
        <WikiHeader />
        <main class="flex-1">
            <slot />
        </main>
        <footer class="text-muted-foreground border-t px-4 py-8 text-center text-sm">
            <p>A fan wiki for Titan War.</p>
            <p class="mt-1">Unofficial, and not affiliated with or endorsed by its creators.</p>
        </footer>
        <HeroCommand />
    </div>
</template>
