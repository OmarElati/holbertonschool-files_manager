const {MongoClient} = require('mongodb');

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const database = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${host}:${port}`;

class DBClient {
	constructor() {
		this.connect();
	}

	async connect() {
		try {
			const client = await MongoClient.connect(url, {useUnifiedTopology: true});
			this.db = client.db(database);
			console.log('Connected to MongoDB');
		} catch (error) {
			console.error('Error connecting to MongoDB:', error);
			process.exit(1);
		}
	}

	isAlive() {
		return Boolean(this.db);
	}

	async nbUsers() {
		return this.db.collection('users').countDocuments();
	}

	async nbFiles() {
		return this.db.collection('files').countDocuments();
	}
}

const dbClient = new DBClient();
module.exports = dbClient;
