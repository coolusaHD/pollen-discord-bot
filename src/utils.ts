import dotenv from 'dotenv';
dotenv.config();

/**
 * The function `envOrError` retrieves the value of an environment variable and throws an error if it
 * is not found.
 * @param {string} name - The `name` parameter is a string that represents the name of the environment
 * variable that you want to retrieve.
 * @returns The function `envOrError` returns a string value.
 */
const envOrError = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`No ${name} found. Please set ${name} in .env`);
  }
  return value;
};

export const POLLEN_BOT_TOKEN = envOrError('POLLEN_BOT_TOKEN');
export const POLLEN_BOT_GUILD_ID = envOrError('POLLEN_BOT_GUILD_ID');
export const POLLEN_BOT_CLIENT_ID = envOrError('POLLEN_BOT_CLIENT_ID');
