require('dotenv').config();

module.exports = {
    APP: {
        PORT: process.env.PORT,
        NODE_ENV: process.env.NODE_ENV,
        BASE_URL: process.env.BASE_URL,
        SW_USERNAME: process.env.SW_USERNAME,
        SW_PASSWORD: process.env.SW_PASSWORD,
    },
    JWT: {
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
        ACCESS_TOKEN_TIME: '2d', //process.env.ACCESS_TOKEN_TIME,
        REFRESH_TOKEN_TIME: '7d', //process.env.REFRESH_TOKEN_TIME,
        RESET_TOKEN_TIME: '10m',
    },
    DB: {
        DB_USERNAME: process.env.DB_USERNAME || "postgres",
        DB_PASSWORD: process.env.DB_PASSWORD || "password",
        DB_NAME: process.env.DB_NAME || "dealamaze_notification_db",
        DB_HOST: process.env.DB_HOST || "127.0.0.1",
        DB_DIALECT: process.env.DB_DIALECT || "postgres",
        DB_PORT: process.env.DB_PORT || 5432
    },
    SMTP: {
        HOST: process.env.SMTP_HOST,
        PORT: parseInt(process.env.SMTP_PORT) || 465,
        SECURE: process.env.SMTP_SECURE === 'true',
        USER: process.env.SMTP_USER,
        PASS: process.env.SMTP_PASS,
        FROM: process.env.SMTP_FROM || 'DealAmaze <operations@gotruks.com>',
    },
    AWS: {
        ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        REGION: process.env.AWS_REGION,
        QUEUES: {
            ORDERS: process.env.AWS_SQS_ORDERS_URL,
            PROMOTIONS: process.env.AWS_SQS_PROMOTIONS_URL,
        }
    },
    FCM: {
        PROJECT_ID: process.env.FCM_PROJECT_ID,
        CLIENT_EMAIL: process.env.FCM_CLIENT_EMAIL,
        PRIVATE_KEY: process.env.FCM_PRIVATE_KEY ? process.env.FCM_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '') : undefined
    }
};
