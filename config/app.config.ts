import { registerAs } from '@nestjs/config';

export interface IAppConfig {
  apiDocsPath: string;
  port: number;
}

const AppConfig = registerAs(
  'appConfig',
  (): IAppConfig => ({
    apiDocsPath: process.env.API_DOCS_PATH,
    port: parseInt(process.env.PORT) || 9000,
  }),
);

export default AppConfig;
