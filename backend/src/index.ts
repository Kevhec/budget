import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import sequelize from './config/database';
import responseInterceptor from './middleware/interceptors';
import { budgetRoutes, expenseRoutes, userRoutes } from './router';

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
app.use('/api/expense', expenseRoutes);

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
