import express from 'express';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import { SequelizeStorage, Umzug } from 'umzug';
import responseInterceptor from './middleware/interceptors';
import {
  budgetRoutes, transactionRoutes, pageRouter, userRoutes,
  categoryRouter,
} from './router';
import SequelizeConnection from './database/config/SequelizeConnection';
import startCronManager from './lib/cron_manager';

const sequelize = SequelizeConnection.getInstance();

const app = express();
const PORT = 3000;

// CORS Options
const allowedDomains = [process.env.FRONTEND_URL];
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (allowedDomains.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(responseInterceptor);

app.use('/api/user', userRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/page', pageRouter);
app.use('/api/category', categoryRouter);

sequelize.sync().then(async () => {
  console.log('Database synchronized');
});

startCronManager();

// UMZUG (migrations tool)
const runMigrations = async () => {
  const umzug = new Umzug({
    migrations: { glob: 'src/database/migrations/*.js' },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });

  await umzug.up();
};

runMigrations().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});

/* const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log('Middleware executed');
  next(err);
};

app.use(errorHandler) */

app.listen(PORT, () => {
  console.log(
    `Server listening to port ${PORT} \n
    at http://localhost:3000/`,
  );
});
