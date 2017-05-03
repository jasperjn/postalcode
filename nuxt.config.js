module.exports = {
    env: {
        baseUrl: process.env.BASE_URL || 'http://localhost:3000'
    },
    head: {
        title: 'starter',
        meta: [{
                charset: 'utf-8'
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            },
            {
                hid: 'description',
                name: 'description',
                content: 'Nuxt.js project'
            }
        ],
        script: [{
            src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCLwJGQB3afCJJCSDYF108mgqkwyUGejC4&libraries=places&language=zh-TW'
        }],
        link: [{
            rel: 'icon',
            type: 'image/x-icon',
            href: '/favicon.ico'
        }]
    },
    /*
     ** Customize the progress-bar color
     */
    loading: {
        color: '#3B8070'
    },
    /*
     ** Build configuration
     */
    css: ['~assets/css/main.css'],
    build: {
        vendor: ['axios', 'gsap'],
        extend(config) {
            for (rule of config.module.rules) {
                if (rule.loader === 'vue-loader') {
                    rule.query.loaders.ts = 'ts-loader?{"appendTsSuffixTo":["\\\\.vue$"]}';
                }
            }
            // TODO: import declaration files hack
            config.externals = {
                'googlemaps': 'console'
            };
        }
    },
    router: {
        base: '/postalcode/'
    }
};
