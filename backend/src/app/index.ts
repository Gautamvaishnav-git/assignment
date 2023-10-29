import compression from 'compression';
import cors from 'cors';
import dotEnv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import v1Router from './v1.router';

dotEnv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/api/v1', v1Router);

export default app;
