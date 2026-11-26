import { createClient } from "redis"

function getConnectionString() {
    const password = process.env.REDIS_PASSWORD
    const host = process.env.REDIS_HOST
    const port = process.env.REDIS_PORT
    const dbNumber = process.env.REDIS_DB_NUMBER


    if (password) {
        const str = `redis://:${password}@${host}:${port}/${dbNumber}`
        return str
    } else {
        const str = `redis://${host}:${port}/${dbNumber}`
        return str
    }
}
const redis = createClient({ url: getConnectionString() })

// Without a listener, a dropped connection is an unhandled 'error' event that kills the process.
// The client reconnects on its own.
redis.on('error', (err) => console.error(`[REDIS] ${err.message}`))

export default redis