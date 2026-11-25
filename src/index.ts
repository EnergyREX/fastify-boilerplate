import 'dotenv/config'
import Fastify from 'fastify'

import routes from './presentation/routes/routes.ts'
import plugins from './config/plugins.ts'

const API_PORT: number = Number(process.env.API_PORT) || 6500
const fastify = Fastify({
    // Behind a reverse proxy, set TRUST_PROXY to the proxy's IP or CIDR so rate limits apply
    // per client. Never trust every address: clients could then spoof X-Forwarded-For.
    trustProxy: process.env.TRUST_PROXY || false,
    logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        ignore: 'pid,hostname'
      }
    }
  }
})

await fastify.register(plugins)
await fastify.register(routes)

fastify.listen({ port: API_PORT }, function (err) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.log(`[STATUS] Server running`)
})
