import { ReadonlyURLSearchParams } from 'next/navigation';

export const baseUrl = process.env.BASE_URL
  ? `https://${process.env.BASE_URL}`
  : 'http://localhost:3000';

export const createUrl = (pathname: string, params: URLSearchParams | ReadonlyURLSearchParams) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const validateEnvironmentVariables = () => {
  const requiredEnvironmentVariables = [
    'API_HOST',
    'ORG_ID',
    'CHANNEL_KEY',
    'CLIENT_ID',
    'CLIENT_SECRET',
  ];
  const missingEnvironmentVariables = [] as string[];

  requiredEnvironmentVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      missingEnvironmentVariables.push(envVar);
    }
  });

  if (missingEnvironmentVariables.length) {
    throw new Error(
      `The following environment variables are missing. Your site will not work without them.\n\n${missingEnvironmentVariables.join(
        '\n'
      )}\n`
    );
  }
};
