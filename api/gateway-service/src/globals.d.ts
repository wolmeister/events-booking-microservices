declare global {
  namespace Express {
    interface AuthPayload {
      userId: number;
    }

    interface Request {
      auth?: AuthPayload;
    }
  }
}

export {};
