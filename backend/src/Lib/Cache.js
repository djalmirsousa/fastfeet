import Redis from 'ioredis';

class Cache {
  constructor() {
    if (process.env.NODE_ENV !== 'test') {
      this.redis = new Redis({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        keyPrefix: 'cache:',
      });
    }
  }

  set(key, value) {
    if (process.env.NODE_ENV !== 'test') {
      this.redis.set(key, JSON.stringify(value), 'EX', 60 * 60 * 24);
    }
  }

  async get(key) {
    if (process.env.NODE_ENV === 'test') {
      return null;
    }
    const cached = await this.redis.get(key);

    return cached ? JSON.parse(cached) : null;
  }

  invalidate(key) {
    if (process.env.NODE_ENV === 'test') {
      return null;
    }
    return this.redis.del(key);
  }

  async invalidatePrefixes(prefixes) {
    if (process.env.NODE_ENV === 'test') {
      return null;
    }

    const keysPromise = prefixes.map(prefix =>
      this.redis.keys(`cache:${prefix}:*`)
    );

    const keys = (await Promise.all(keysPromise)).map(e =>
      e.map(f => f.replace('cache:', ''))
    );
    let concatKeys = [];
    keys.forEach(keyArray => {
      concatKeys = [...concatKeys, ...keyArray];
    });

    if (!concatKeys[0]) {
      return null;
    }

    return this.redis.del(concatKeys);
  }
}

export default new Cache();
