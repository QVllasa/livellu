/** @type {import('next').NextConfig} */
const runtimeCaching = require('next-pwa/cache');
// const {i18n} = require('./next-i18next.config');
const withPWA = require('next-pwa')({
    disable: process.env.NODE_ENV === 'development',
    dest: 'public',
    runtimeCaching,
});

module.exports = withPWA({
    reactStrictMode: true,
    // i18n,
    images: {
        domains: [
            'localhost:1337',
            'localhost',
            '127.0.0.1',
            '127.0.0.1:1337',
            'res.cloudinary.com',
            'livellu-app.webqube.de',
            'livellu-api.webqube.de',
            'i.otto.de'
        ],
    },
    ...(process.env.FRAMEWORK_PROVIDER === 'graphql' && {
        webpack(config, options) {
            config.module.rules.push({
                test: /\.graphql$/,
                exclude: /node_modules/,
                use: [options.defaultLoaders.babel, {loader: 'graphql-let/loader'}],
            });

            config.module.rules.push({
                test: /\.ya?ml$/,
                type: 'json',
                use: 'yaml-loader',
            });

            return config;
        },
    }),
    ...(process.env.APPLICATION_MODE === 'production' && {
        typescript: {
            ignoreBuildErrors: true,
        },
        eslint: {
            ignoreDuringBuilds: true,
        },
    }),
    env: {
        NEXT_PUBLIC_STRAPI_API_TOKEN: process.env.NEXT_PUBLIC_STRAPI_API_TOKEN,
        NEXT_PUBLIC_STRAPI_REST_API_URL: process.env.NEXT_PUBLIC_STRAPI_REST_API_URL,
        NEXT_PUBLIC_STRAPI_HOST: process.env.NEXT_PUBLIC_STRAPI_HOST,
        NEXT_PUBLIC_HOST: process.env.NEXT_PUBLIC_HOST,
        PORT: process.env.PORT,
        FRAMEWORK_PROVIDER: process.env.FRAMEWORK_PROVIDER,
        APPLICATION_MODE: process.env.APPLICATION_MODE,
        NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
        NEXT_PUBLIC_DEFAULT_LANGUAGE: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE,
        NEXT_PUBLIC_ENABLE_MULTI_LANG: process.env.NEXT_PUBLIC_ENABLE_MULTI_LANG,
        NEXT_PUBLIC_AVAILABLE_LANGUAGES: process.env.NEXT_PUBLIC_AVAILABLE_LANGUAGES,
    },
});
