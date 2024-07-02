const runtimeCaching = require('next-pwa/cache');
const withPWA = require('next-pwa')({
    disable: process.env.NODE_ENV === 'development',
    dest: 'public',
    runtimeCaching,
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '1337',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '1337',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'livellu-app.webqube.de',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'livellu-api.webqube.de',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'otto.de',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'i.otto.de',
                pathname: '/**',
            }
        ],
    },
    ...(process.env.FRAMEWORK_PROVIDER === 'graphql' && {
        webpack(config, options) {
            config.module.rules.push({
                test: /\.graphql$/,
                exclude: /node_modules/,
                use: [options.defaultLoaders.babel, { loader: 'graphql-let/loader' }],
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

module.exports = nextConfig;
