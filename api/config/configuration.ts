// configuration.ts

export const configuration = () => ({
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    },
    database: {
        host: process.env.DATABASE_HOST ?? '127.0.0.1',
        port: Number(process.env.DATABASE_PORT ?? 3306),
        username: process.env.DATABASE_USERNAME ?? 'root',
        password: process.env.DATABASE_PASSWORD ?? 'root',
        name: process.env.DATABASE_NAME ?? 'Goto',
    },
    port: Number(process.env.PORT ?? 3000),
});
