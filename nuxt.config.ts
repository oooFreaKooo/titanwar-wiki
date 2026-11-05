import tailwindcss from '@tailwindcss/vite'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },

    modules: [
        '@nuxtjs/color-mode',
        '@vueuse/nuxt',
        '@nuxt/icon',
        '@nuxt/fonts',
        '@nuxt/eslint',
    ],

    imports: {
        imports: [
            {
                from: 'tailwind-variants',
                name: 'tv',
            }, {
                from: 'tailwind-variants',
                name: 'VariantProps',
                type: true,
            },
        ],
    },

    eslint: {
        config: {
            stylistic: {
                commaDangle: 'always-multiline',
            },
            nuxt: {
                sortConfigKeys: false,
            },
        },
    },

    colorMode: {
        storageKey: 'wiki-color-mode',
        classSuffix: '',
        preference: 'dark',
        fallback: 'dark',
    },

    app: {
        // Project Pages live at /titanwar-wiki/. Leave this unset for local dev.
        baseURL: process.env.NUXT_APP_BASE_URL || '/',
        head: {
            title: 'Titan War Wiki',
            htmlAttrs: { lang: 'en' },
            meta: [{ name: 'description', content: 'A fan wiki for Titan War heroes, skins, and gear.' }],
        },
    },

    icon: {
        clientBundle: {
            scan: true,
            sizeLimitKb: 0,
        },

        mode: 'svg',
        class: 'shrink-0',
        fetchTimeout: 2000,
        serverBundle: 'local',
    },

    fonts: {
        processCSSVariables: true,
        families: [
            // UI and skill text. Weights match font-normal, font-medium, and font-semibold.
            { name: 'Outfit', provider: 'google', weights: [ 400, 500, 600 ] },
            // Titles and the wordmark. A squared technical sans, kept off body copy.
            { name: 'Oxanium', provider: 'google', weights: [600] },
        ],
    },

    css: ['~/assets/css/tailwind.css'],

    vite: {
        plugins: [tailwindcss()],
    },
})
