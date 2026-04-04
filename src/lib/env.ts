function readServerEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function readOptionalServerEnv(name: string, defaultValue: string): string {
  return process.env[name] ?? defaultValue;
}

export const serverEnv = {
  apiBaseUrl: readServerEnv('API_BASE_URL'),
  apiBasicAuthUser: readServerEnv('API_BASIC_AUTH_USER'),
  apiBasicAuthPassword: readServerEnv('API_BASIC_AUTH_PASSWORD'),
  tmdbAccessToken: readOptionalServerEnv('TMDB_ACCESS_TOKEN', ''),
  tmdbImageSearchEnabled:
    readOptionalServerEnv('TMDB_IMAGE_SEARCH_ENABLED', 'true') === 'true',
};
