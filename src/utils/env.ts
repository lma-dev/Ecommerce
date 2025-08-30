export const env = {
    // App
    APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? 'App',
    APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION ?? 'v1',
    NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV ?? 'development',

    // Backend
    BACKEND_API_URL: process.env.NEXT_PUBLIC_BACKEND_API_URL ?? '',
    BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL ?? '',

    // Firebase
    FIREBASE: {
        API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
        AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
        PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
        STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
        MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
        APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
        MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? ''
    },

    // Security
    DECRYPT_KEY: process.env.NEXT_PUBLIC_DECRYPT_KEY ?? '',

    // Auth (non-public: available only on server side)
    NEXTAUTH: {
        JWT_SECRET: process.env.NEXTAUTH_JWT_SECRET ?? '',
        SECRET: process.env.NEXTAUTH_SECRET ?? ''
    },

    // OAuth Providers (server only)
    GOOGLE: {
        CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? '',
        CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? '',
        REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI ?? ''
    },
    GITHUB: {
        CLIENT_ID: process.env.GITHUB_CLIENT_ID ?? '',
        CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET ?? '',
        REDIRECT_URI: process.env.GITHUB_REDIRECT_URI ?? ''
    }
};
