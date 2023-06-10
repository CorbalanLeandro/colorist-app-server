import { DEFAULT_APP_PORT } from '../constants';
import { demandEnv } from '../utils';

export interface IAppConfig {
  app: {
    env: string;
    port: number;
  };
  db: {
    name: string;
    params: string;
    uri: string;
    url: string;
  };
  jwt: {
    expiresIn: string;
    secret: string;
  };
}

export default (): IAppConfig => {
  const dbUrl = demandEnv('DB_URL'),
    dbName = demandEnv('DB_NAME'),
    dbParams = demandEnv('DB_PARAMS');

  return {
    app: {
      env: demandEnv('ENV'),
      port: parseInt(demandEnv('PORT', DEFAULT_APP_PORT), 10),
    },
    db: {
      name: dbName,
      params: dbParams,
      uri: `${dbUrl}/${dbName}?${dbParams}`,
      url: dbUrl,
    },
    jwt: {
      expiresIn: demandEnv('JWT_EXPIRES_IN'),
      secret: demandEnv('JWT_SECRET'),
    },
  };
};
