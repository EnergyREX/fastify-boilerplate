import fp from 'fastify-plugin'
import rateLimit from '@fastify/rate-limit'
import { FastifyPluginAsync } from 'fastify'

// Not global: each route opts in through `fastify.rateLimit()`.
const rateLimits: FastifyPluginAsync = async (fastify) => {
    await fastify.register(rateLimit, {
        global: false,
        hook: 'preHandler'
    })
}

export default fp(rateLimits)
