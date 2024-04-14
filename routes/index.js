import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController'; 

const router = (app) => {
  const route = express.Router();
  app.use(express.json());
  app.use('/', route);

  route.get('/status', (req, res) => AppController.getStatus(req, res));
  route.get('/stats', (req, res) => AppController.getStats(req, res));
  route.post('/users', (req, res) => UsersController.postNew(req, res));
  route.get('/connect', (request, response) => AuthController.getConnect(request, response));
  route.get('/disconnect', (request, response) => AuthController.getDisconnect(request, response));
  route.get('/users/me', (request, response) => UsersController.getMe(request, response));
};

export default router;
