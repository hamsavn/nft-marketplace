import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default () => {
  const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrationsTableName: 'migration',
    migrations: ['src/migration/*.ts'],
    cli: {
      migrationsDir: 'src/migration',
    },
    synchronize: !!process.env.DB_SYNC,
  };

  return {
    typeOrmConfig,
    isProduction: process.env.NODE_ENV === 'production',
  };
};
