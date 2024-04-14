const { MongoClient } = require('mongodb');

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 27017;
const dbName = process.env.DB_DATABASE || 'files_manager';
const dbUrl = `mongodb://${dbHost}:${dbPort}`;

class DBClient {
  constructor() {
    MongoClient.connect(dbUrl, (err, client) => {
      if (!err) {
        this.db = client.db(dbName);
      } else {
        this.db = false;
      }
    });
  }

  isAlive() {
    return !!this.db;
  }

  async nbUsers() {
    if (!this.db) return 0;
    return this.db.collection('users').countDocuments();
  }

  async nbFiles() {
    if (!this.db) return 0;
    return this.db.collection('files').countDocuments();
  }
}

const dbClient = new DBClient();
export default dbClient;
