// Handler must follow this:
// It must run AFTER `fastify.authenticate` in the preHandler chain, since it trusts
// `req.user`, which is only populated once the JWT signature has been verified.
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from 'fastify-plugin'
import { jwtData } from "../types/jwtData.ts";
import { RoleCacheImpl } from "../../infrastructure/cache/RoleCacheImpl.ts";

const permissions = async(fastify: FastifyInstance) => {
    const roleCache = new RoleCacheImpl()

    fastify.decorate('hasPermission', (permission: string) => {
        return async (req: FastifyRequest, reply: FastifyReply) => {
            const decodedAccess = req.user as jwtData

            for (const roleUuid of decodedAccess.roles) {
                const result = await roleCache.getPermissions(roleUuid)
                if (!result.ok) continue

                const hasPermission = result.value.some(p => p.getName() === permission)
                if (hasPermission) return
            }

            return reply.code(403).send({ ok: false, error: { message: 'Forbidden', code: 'ERR_PREHDL_FORBIDDEN' } })
        }
    })
}


export default fp(permissions)
