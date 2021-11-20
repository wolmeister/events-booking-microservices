declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      MAILJET_API_KEY: string;
      MAILJET_API_SECRET: string;
      MAILJET_FROM_EMAIL: string;
      MAILJET_FROM_NAME: string;
    }
  }
}

export {};
