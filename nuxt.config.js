module.exports = {
    /*
    ** Headers of the page
    */
    head: {
        title: 'Jeopardy Game',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: 'Simple jeopardy game' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ],
        script: [
            { src: 'http://www.youtube.com/player_api' }
        ]
    },
    modules: [
        'bootstrap-vue/nuxt',
        '@nuxtjs/axios'
    ],
    plugins: [
        '~/plugins/youtube'
    ],
    css: [
        { src: '~/assets/iconic/font/css/open-iconic-bootstrap.css' }
    ],
    axios: {
        // baseURL: (process.env.NODE_ENV === 'prod') ? '/' : 'http://localhost:3000'
        baseURL: '/'
    },
    /*
    ** Customize the progress bar color
    */
    loading: { color: '#3B8070' },
    /*
    ** Build configuration
    */
    build: {
        vendor: ['vue-youtube-embed'],
        /*
        ** Run ESLint on save
        */
        extend (config, { isDev, isClient }) {
            if (isDev && isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue|otf)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/
                })
            }
        }
    }
};
