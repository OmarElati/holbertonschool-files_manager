import sha1 from 'sha1';
import DBClient from '../utils/db';
import RedisClient from '../utils/redis';

const { ObjectId } = require('mongodb');

class UsersController {
  static async postNew(req, res) {
    const userEmail = req.body.email;
    if (!userEmail) return res.status(400).json({ error: 'Missing email' });

    const userPassword = req.body.password;
    if (!userPassword) return res.status(400).json({ error: 'Missing password' });

    const oldUserEmail = await DBClient.db.collection('users').findOne({ email: userEmail });
    if (oldUserEmail) return res.status(400).json({ error: 'Already exist' });

    const shaUserPassword = sha1(userPassword);
    const result = await DBClient.db.collection('users').insertOne({ email: userEmail, password: shaUserPassword });

    return res.status(201).json({ id: result.insertedId, email: userEmail });
  }

  static async getMe(request, response) {
    const token = request.header('X-Token') || null;
    if (!token) return response.status(401).send({ error: 'Unauthorized' });

    const redisToken = await RedisClient.get(`auth_${token}`);
    if (!redisToken) return response.status(401).send({ error: 'Unauthorized' });

    const user = await DBClient.db.collection('users').findOne({ _id: ObjectId(redisToken) });
    if (!user) return response.status(401).send({ error: 'Unauthorized' });
    delete user.password;

    return response.status(200).send({ id: user._id, email: user.email });
  }
}

export default UsersController;
