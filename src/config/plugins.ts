import { FastifyInstance, FastifyPluginAsync } from "fastify"
import fp from 'fastify-plugin'

import cors from "./plugins/cors.ts"
import swagger from "./plugins/swagger.ts"
import jwt from "./plugins/jwt.ts"
import cookies from "./plugins/cookies.ts"

const plugins: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    await fastify.register(cors)
    await fastify.register(swagger)
    await fastify.register(jwt)
    await fastify.register(cookies)
}

export default fp(plugins)
