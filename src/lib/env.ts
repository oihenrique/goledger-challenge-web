function readServerEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const serverEnv = {
  apiBaseUrl: readServerEnv('API_BASE_URL'),
  apiBasicAuthUser: readServerEnv('API_BASIC_AUTH_USER'),
  apiBasicAuthPassword: readServerEnv('API_BASIC_AUTH_PASSWORD'),
};
