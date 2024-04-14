import { hash } from 'bcrypt';
import DBClient from '../utils/db';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const userExists = await DBClient.getUser({ email });

    if (userExists) {
      return res.status(400).json({ error: 'Already exist' });
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await DBClient.createUser({ email, password: hashedPassword });

    return res.status(201).json({ id: newUser._id, email: newUser.email });
  }
}

export default UsersController;
