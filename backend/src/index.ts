import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import responseInterceptor from './middleware/interceptors';
import {
  budgetRoutes, transactionRoutes, pageRouter, userRoutes,
  categoryRouter,
} from './router';
import SequelizeConnection from './database/SequelizeConnection';

const sequelize = SequelizeConnection.getInstance();

const app = express();
const PORT = 3000;

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(responseInterceptor);

app.use('/api/user', userRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/page', pageRouter);
app.use('/api/category', categoryRouter);

sequelize.sync({ force: true }).then(() => {
  console.log('Database has been re sync');
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
