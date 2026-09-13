import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { CreateRoleRequest } from "../../types/request/CreateRoleRequest.ts";
import { UpdateRoleRequest } from "../../types/request/UpdateRoleRequest.ts";
import container from "../../../bootstrap/bootstrap.ts";

export default async function (fastify: FastifyInstance, opts: FastifyPluginOptions) {

    fastify.post('/roles', {
        preHandler: [fastify.authenticate, fastify.hasPermission('roles:create')],
        schema: {
            summary: "Creates a new role.",
            tags: ["Roles"]
        }
    }, async (req: FastifyRequest, reply: FastifyReply) => {
        const { name, description, permissions } = req.body as CreateRoleRequest

        try {
            const result = await container.roles.create({ name, description, permissions })
            if (result.ok) {
                reply.code(200).send({ ok: true, uuid: result.value })
            } else {
                reply.code(400).send({ ok: false, error: result.error })
            }
        } catch (err) {
            reply.code(400).send({ ok: false, error: err })
        }
    })

    fastify.get('/roles', {
        preHandler: [fastify.authenticate, fastify.hasPermission('roles:read')],
        schema: {
            summary: "Gets all roles.",
            tags: ["Roles"]
        }
    }, async (_req: FastifyRequest, reply: FastifyReply) => {
        try {
            const result = await container.roles.getAll()
            if (result.ok) {
                reply.code(200).send({ ok: true, data: result.value })
            } else {
                reply.code(400).send({ ok: false, error: result.error })
            }
        } catch (err) {
            reply.code(400).send({ ok: false, error: err })
        }
    })

    fastify.get('/roles/:uuid', {
        preHandler: [fastify.authenticate, fastify.hasPermission('roles:read')],
        schema: {
            summary: "Gets a role by its uuid.",
            tags: ["Roles"]
        }
    }, async (req: FastifyRequest, reply: FastifyReply) => {
        const { uuid } = req.params as { uuid: string }

        try {
            const result = await container.roles.get({ uuid })
            if (result.ok) {
                reply.code(200).send({ ok: true, data: result.value })
            } else {
                reply.code(400).send({ ok: false, error: result.error })
            }
        } catch (err) {
            reply.code(400).send({ ok: false, error: err })
        }
    })

    fastify.patch('/roles/:uuid', {
        preHandler: [fastify.authenticate, fastify.hasPermission('roles:update')],
        schema: {
            summary: "Updates a role.",
            tags: ["Roles"]
        }
    }, async (req: FastifyRequest, reply: FastifyReply) => {
        const { uuid } = req.params as { uuid: string }
        const { name, description, permissions } = req.body as UpdateRoleRequest

        try {
            const result = await container.roles.update({ uuid, name, description, permissions })
            if (result.ok) {
                reply.code(200).send({ ok: true })
            } else {
                reply.code(400).send({ ok: false, error: result.error })
            }
        } catch (err) {
            reply.code(400).send({ ok: false, error: err })
        }
    })

    fastify.delete('/roles/:uuid', {
        preHandler: [fastify.authenticate, fastify.hasPermission('roles:delete')],
        schema: {
            summary: "Deletes a role.",
            tags: ["Roles"]
        }
    }, async (req: FastifyRequest, reply: FastifyReply) => {
        const { uuid } = req.params as { uuid: string }

        try {
            const result = await container.roles.delete({ uuid })
            if (result.ok) {
                reply.code(200).send({ ok: true })
            } else {
                reply.code(400).send({ ok: false, error: result.error })
            }
        } catch (err) {
            reply.code(400).send({ ok: false, error: err })
        }
    })
}
