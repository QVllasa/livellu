/** @type {import('next').NextConfig} */
const runtimeCaching = require('next-pwa/cache');
const {i18n} = require('./next-i18next.config');
const withPWA = require('next-pwa')({
    disable: process.env.NODE_ENV === 'development',
    dest: 'public',
    runtimeCaching,
});

module.exports = withPWA({
    reactStrictMode: true,
    i18n,
    images: {
        domains: [
            'pickbazarlaravel.s3.ap-southeast-1.amazonaws.com',
            'pixarlaravel.s3.ap-southeast-1.amazonaws.com',
            'lh3.googleusercontent.com',
            'localhost:1337',
            'localhost',
            '127.0.0.1',
            '127.0.0.1:1337',
            'i.pravatar.cc',
            'cdn.pixabay.com',
            'livellu-app-c5418d59d2e7.herokuapp.com',
            'livellu-api-d133f68c647d.herokuapp.com'
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
});
