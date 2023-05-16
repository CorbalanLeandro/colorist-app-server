/**
 * Gets the environment variable.
 *
 * @param {string} key Environment variable key
 * @param {string | undefined} defaultValue Default value if the environment variable is undefined.
 * @returns {string} Environment variable value or the default value.
 * @throws {Error} if the environment variable is missing.
 */
export const demandEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw new Error(`Environment variable ${key} is required.`);
  }

  return value;
};
