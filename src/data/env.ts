import { config } from "dotenv"
import z from "zod"

config({ quiet: true })

const EnvSchema = z.object({
    // API
    PORT: z.coerce.number().default(3000),

    // DB
    DB_FILE: z.string().min(1),

    // MISC
    JWT_SECRET: z.string().min(4),
})

const parsedEnv = EnvSchema.safeParse(process.env)

if (!parsedEnv.success) {
    throw new Error(`Invalid Env: ${z.prettifyError(parsedEnv.error)}`)
}

export const env = parsedEnv.data