import { DEFAULT_APP_PORT } from '../constants';
import { demandEnv } from '../utils';

export interface IAppConfig {
  app: {
    env: string;
    port: number;
  };
  auth: {
    jwt: {
      expiresIn: string;
      secret: string;
    };
    passwordSalt: string;
  };
  db: {
    name: string;
    params: string;
    uri: string;
    url: string;
  };
  throttle: {
    auth: {
      limit: number;
      ttlMs: number;
    };
    limit: number;
    ttlMs: number;
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
    auth: {
      jwt: {
        expiresIn: demandEnv('JWT_EXPIRES_IN'),
        secret: demandEnv('JWT_SECRET'),
      },
      passwordSalt: demandEnv('PASSWORD_SALT'),
    },
    db: {
      name: dbName,
      params: dbParams,
      uri: `${dbUrl}/${dbName}?${dbParams}`,
      url: dbUrl,
    },
    throttle: {
      auth: {
        limit: parseInt(demandEnv('THROTTLE_AUTH_LIMIT', '5'), 10),
        ttlMs: parseInt(demandEnv('THROTTLE_AUTH_TTL', '60000'), 10),
      },
      limit: parseInt(demandEnv('THROTTLE_LIMIT', '100'), 10),
      ttlMs: parseInt(demandEnv('THROTTLE_TTL', '60000'), 10),
    },
  };
};
