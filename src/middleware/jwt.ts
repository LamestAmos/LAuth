import { createMiddleware, createFactory } from "hono/factory";
import { env } from '../data/env.ts'
import { verify, type JwtVariables } from "hono/jwt";
import z from "zod";
import { sValidator } from "@hono/standard-validator";


export type Variables = JwtVariables<{
  sub: number
  name: string
  email: string
  age: number
  role: "basic" | "admin"
  exp: number
} | null> 

const authSchema = z.object({
    authentication: z.string().min(10).optional()
})

export const jwtMiddleware = createFactory<{Variables: Variables}>().createHandlers(sValidator("header", authSchema), async (c, next) => {
    const {authentication} = c.req.valid("header")
    if (authentication == null) {
        c.set("jwtPayload", null)
        await next()
        return
    }

    const payload = await verify(authentication, env.JWT_SECRET, "HS512")
    c.set("jwtPayload", payload)
    await next()
})