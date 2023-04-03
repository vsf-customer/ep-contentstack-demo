/* eslint-disable camelcase */

import webpack from 'webpack';
import theme from './themeConfig';
import getRoutes from './routes';

export default {
  components: ['~/components/cms/page/', '~/components/cms/layout/'],
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Vue Storefront integration with Elasticpath Commerce Cloud',
    titleTemplate: '%s | Vue Storefront Demo',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'crossorigin'
      }
    ]
  },
  loading: { color: '#fff' },
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],
  serverMiddleware: [
    {
      path: "/healthz",
      handler(req, res, next) {
        res.end("ok");
      }
    }
  ],
  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // to core
    '@nuxtjs/composition-api/module',
    '@pinia/nuxt',
    '@nuxt/typescript-build',
    '@nuxtjs/google-fonts',
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources',
    [
      '@vue-storefront/nuxt',
      {
        useRawSource: {
          dev: ['@vsf-enterprise/epcc', '@vue-storefront/core', '@vsf-enterprise/contentstack'],
          prod: ['@vsf-enterprise/epcc', '@vue-storefront/core', '@vsf-enterprise/contentstack']
        }
      }
    ],
    ['~/modules/epcc']
  ],
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@vsf-enterprise/contentstack/nuxt',
    'nuxt-i18n',
    'cookie-universal-nuxt',
    'vue-scrollto/nuxt',
    [
      '@vue-storefront/http-cache/nuxt',
      {
        matchRoute: {
          '/': 'max-age=1800, s-maxage=86400, stale-while-revalidate=86400',
          '/p/*': 'max-age=300, s-maxage=3600, stale-while-revalidate=86400',
          '/c/*': 'max-age=300, s-maxage=3600, stale-while-revalidate=86400',
          '/my-account': 'none',
          '/checkout*': 'none'
        }
      }
    ],
    '@nuxt/image'
  ],
  image: {
    provider: 'cloudinary',
    cloudinary: {
      baseURL: process.env.NUXT_IMAGE_PROVIDER_BASE_URL,
      storagePrefix: process.env.NUXT_IMAGE_PROVIDER_STORAGE_PREFIX,
      uploadDir: process.env.NUXT_IMAGE_PROVIDER_UPLOAD_DIR
    }
  },
  i18n: {
    currency: 'default',
    country: 'US',
    countries: [
      { name: 'US', label: 'United States', states: ['California', 'Nevada'] },
      { name: 'AT', label: 'Austria' },
      { name: 'DE', label: 'Germany' },
      { name: 'NL', label: 'Netherlands' }
    ],
    currencies: [],
    locales: [
      { code: 'en', label: 'English', file: 'en.js', iso: 'en' },
      { code: 'de', label: 'German', file: 'de.js', iso: 'de' }
    ],
    defaultLocale: 'en',
    autoChangeCookie: {
      currency: false,
      locale: false,
      country: false
    },
    lazy: true,
    seo: true,
    langDir: 'lang/',
    vueI18n: {
      fallbackLocale: 'en'
    },
    detectBrowserLanguage: false,
    autoRedirectByLocale: false
  },
  pwa: {
    meta: {
      theme_color: '#5ECE7B',
      name: 'Vue Storefront with Elastic Path Commerce Cloud'
    }
  },
  googleFonts: {
    families: {
      Raleway: {
        wght: [300, 400, 500, 600, 700],
        ital: [400]
      },
      Roboto: {
        wght: [300, 400, 500, 700],
        ital: [300, 400]
      }
    },
    display: 'swap'
  },
  styleResources: {
    scss: [
      require.resolve('@storefront-ui/shared/styles/_helpers.scss', {
        paths: [process.cwd()]
      })
    ]
  },
  publicRuntimeConfig: {
    theme,
    middlewareUrl: process.env.API_BASE_URL || 'http://localhost:8181',
    ssrMiddlewareUrl: process.env.API_SSR_BASE_URL || 'http://localhost:8181'
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    babel: {
      plugins: [['@babel/plugin-proposal-private-methods', { loose: true }]]
    },
    transpile: ['vee-validate/dist/rules'],
    plugins: [
      new webpack.DefinePlugin({
        'process.VERSION': JSON.stringify({
          // eslint-disable-next-line global-require
          version: require('./package.json').version,
          lastCommit: process.env.LAST_COMMIT || ''
        })
      })
    ]
  },
  // Router Configuration: https://nuxtjs.org/docs/configuration-glossary/configuration-router
  router: {
    extendRoutes(routes) {
      routes.splice(
        routes.findIndex((route) => route.name === 'my-account'),
        1
      );

      routes.push(...getRoutes(__dirname));
    }
  }
};
