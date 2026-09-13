import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import redis from '../redis.ts';

const redisPlugin: FastifyPluginAsync = async () => {
    if (!redis.isOpen) {
        await redis.connect()
    }
}

export default fp(redisPlugin)
