import { Sequelize } from 'sequelize';
import dotEnv from 'dotenv';

dotEnv.config();

if (process.env.DATABASE_URL === undefined) {
  throw new Error('DATABASE_URL must be set in .env file');
}

const pgInstance = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false
});

if (process.env.NODE_ENV === 'development') {
  (async () => {
    try {
      console.log('Connecting to PostgreSQL database...');
      await pgInstance.authenticate();
      console.log('PostgreSQL connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  })();
}

export default pgInstance;
