import 'dotenv/config';
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt'
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import { jwtData } from '../types/jwtData.ts';

const auth: FastifyPluginAsync = async (fastify) => {
  const secret = process.env.JWT_SECRET_KEY

  if (!secret) { throw new Error('Secret key is not defined!') }

  await fastify.register(jwt, {
    secret: secret
  })

  fastify.decorate('authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify()
        if ((request.user as jwtData).type !== 'access') {
          return reply.code(401).send({ success: false, message: 'Unauthorized' })
        }
      } catch (err) {
        return reply.code(401).send({ success: false, message: 'Unauthorized' })
      }
  })

}

export default fp(auth)
