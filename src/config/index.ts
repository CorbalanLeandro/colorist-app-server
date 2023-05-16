import { DEFAULT_APP_PORT, ENVIRONMENT } from '../constants';
import { demandEnv } from '../utils';

export interface IAppConfig {
  app: {
    env: string;
    port: number;
  };
}

export default (): IAppConfig => {
  return {
    app: {
      env: demandEnv('ENV', ENVIRONMENT.DEV),
      port: parseInt(demandEnv('PORT', DEFAULT_APP_PORT), 10),
    },
  };
};
