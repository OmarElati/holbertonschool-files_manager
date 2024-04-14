import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
    constructor() {
        this.client = redis.createClient();

        this.getAsync = promisify(this.client.get).bind(this.client);
        this.setAsync = promisify(this.client.setex).bind(this.client);
        this.delAsync = promisify(this.client.del).bind(this.client);

        this.client.on('error', (err) => {
            console.error('Redis error:', err);
        });
    }

    isAlive() {
        return this.client.connected;
    }

    async get(key) {
        try {
            const reply = await this.getAsync(key);
            return reply;
        } catch (err) {
            console.error('Redis error:', err);
            throw err;
        }
    }

    async set(key, value, duration) {
        try {
            const reply = await this.setAsync(key, duration, value);
            return reply;
        } catch (err) {
            console.error('Redis error:', err);
            throw err;
        }
    }

    async del(key) {
        try {
            const reply = await this.delAsync(key);
            return reply;
        } catch (err) {
            console.error('Redis error:', err);
            throw err;
        }
    }
}

const redisClient = new RedisClient();
export default redisClient;
