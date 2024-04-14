import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';
import RedisClient from '../utils/redis';
import DBClient from '../utils/db';

class AuthController {
  static async getConnect(req, res) {
    const authHeader = req.header('Authorization') || '';
    const [type, credentials] = authHeader.split(' ') || [];
    if (type !== 'Basic' || !credentials) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decodedCredentials = Buffer.from(credentials, 'base64').toString('utf-8');
    const [email, password] = decodedCredentials.split(':');

    if (!email || !password) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await DBClient.getUser({ email, password: createHash('sha1').update(password).digest('hex') });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = uuidv4();
    const key = `auth_${token}`;
    await RedisClient.set(key, user._id.toString(), 86400);
    return res.status(200).json({ token });
  }

  static async getDisconnect(req, res) {
    const token = req.header('X-Token');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = await RedisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await RedisClient.del(`auth_${token}`);
    return res.status(204).end();
  }
}

export default AuthController;
