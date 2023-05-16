import { DEFAULT_APP_PORT, ENVIRONMENT } from '../constants';
import { demandEnv } from '../utils';

export interface IAppConfig {
  app: {
    env: string;
    port: number;
  };
  db: {
    url: string;
    name: string;
    params: string;
    uri: string;
  };
}

export default (): IAppConfig => {
  const dbUrl = demandEnv('DB_URL'),
    dbName = demandEnv('DB_NAME'),
    dbParams = demandEnv('DB_PARAMS');

  return {
    app: {
      env: demandEnv('ENV', ENVIRONMENT.DEV),
      port: parseInt(demandEnv('PORT', DEFAULT_APP_PORT), 10),
    },
    db: {
      url: dbUrl,
      name: dbName,
      params: dbParams,
      uri: `${dbUrl}/${dbName}?${dbParams}`,
    },
  };
};
