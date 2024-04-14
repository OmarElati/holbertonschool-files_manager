import sha1 from 'sha1';
import DBClient from '../utils/db';

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
}

export default UsersController;
