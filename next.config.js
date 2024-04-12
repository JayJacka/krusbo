/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'i.scdn.co',
            port: '',
            pathname: '/image/**',
          },
          {
            protocol: 'https',
            hostname: 'seed-mix-image.spotifycdn.com',
            port: '',
            pathname: '/v6/img/**'  
          },
          {
            protocol: 'https',
            hostname: 'thisis-images.spotifycdn.com',
            port: '',
            pathname: '**' 
          },
          {
            protocol: 'https',
            hostname: 'charts-images.scdn.co',
            port: '',
            pathname: '**'
          }
        ],
      },
};

export default config;

