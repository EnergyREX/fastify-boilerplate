import fp from 'fastify-plugin'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import { FastifyPluginAsync } from 'fastify'

const documentation: FastifyPluginAsync = async(fastify) => {
    await fastify.register(swagger, {
        openapi: {
            info: {
                title: 'HytaleServerHub.net API Docs',
                description: 'API Docs for Hytale Server Hub',
                version: '0.1.0'
            }
        }
    })

    await fastify.register(swaggerUI, {
    routePrefix: '/documentation',
    uiConfig: {
        docExpansion: 'list',
        deepLinking: false
    },
    uiHooks: {
        onRequest: function (request, reply, next) { next() },
        preHandler: function (request, reply, next) { next() }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
    transformSpecificationClone: true
    })
}

export default fp(documentation)
