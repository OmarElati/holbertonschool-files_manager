import sha1 from 'sha1';
import DBClient from '../utils/db';
import RedisClient from '../utils/redis';

const { ObjectId } = require('mongodb');

class UsersController {
  static async createUser(req, res) {
    const userEmail = req.body.email;
    if (!userEmail) return res.status(400).json({ error: 'Missing email' });

    const userPassword = req.body.password;
    if (!userPassword) return res.status(400).json({ error: 'Missing password' });

    const existingUser = await DBClient.db
      .collection('users')
      .findOne({ email: userEmail });
    if (existingUser) return res.status(400).json({ error: 'Already exists' });

    const hashedPassword = sha1(userPassword);
    const result = await DBClient.db
      .collection('users')
      .insertOne({ email: userEmail, password: hashedPassword });

    return res.status(201).json({ id: result.insertedId, email: userEmail });
  }
}

export default UsersController;
