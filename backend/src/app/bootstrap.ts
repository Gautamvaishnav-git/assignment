import pgInstance from '../db/pg.db';
import { GetListModel } from '../model/list.model';
import { GetTaskModel } from '../model/task.model';
import { GetUserModel } from '../model/user.model';

export async function bootstrap(): Promise<void> {
  try {
    envCheck();
    console.log('\nBootstrapping the application...');
    await new GetUserModel(pgInstance).UserModel.sync();
    await new GetListModel(pgInstance).listModel.sync();
    await new GetTaskModel(pgInstance).taskModel.sync();
    console.log('\nDone bootstrapping the application.');
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const envCheck = (): void => {
  console.log('\n 🟠 Checking environment variables...');
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }
  console.log(' ✅ Environment variables are defined.');
};
