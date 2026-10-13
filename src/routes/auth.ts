import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import z from "zod";
import { db } from "../db/index.ts";
import { users } from "../db/schema.ts";
import { hashPassword, verifyPassword } from "../lib/auth.ts";
import { eq, getColumns } from "drizzle-orm";
import { sign } from 'hono/jwt'
import { env } from "../data/env.ts";

const app = new Hono()

const registerSchema = z.object({
    email: z.email().min(1),
    password: z.string().min(8),
    age: z.int().min(1),
    name: z.string().min(1)
})

const loginSchema = registerSchema.pick({email: true, password: true})

const { passwordHash: _, ...fields } = getColumns(users)

app.post("/register", sValidator("json", registerSchema), async (c) => {
    const { age, email, name, password } = c.req.valid("json")

    const [existingUser] = await db.select({...fields}).from(users).where(eq(users.email, email))

    if (existingUser != null) {
        return c.json({error: "Email already in use"}, 409)
    }

    const passwordHash = await hashPassword(password)

    const [user] = await db.insert(users).values({age, email, name, passwordHash}).returning({...fields})

    return c.json({ user }, 201)
})

app.post("login", sValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json")

    const [user] = await db.select().from(users).where(eq(users.email, email))

    if (user == null) {
        return c.json({error: "Invalid Email or Password"}, 401)
    }

    const validPassword = await verifyPassword(password, user.passwordHash)

    if (!validPassword) {
        return c.json({error: "Invalid Email or Password"}, 401)
    }

    const payload = {
        sub: user.id,
        role: user.role,
        email: user.email,
        name: user.name,
        age: user.age,
        exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
    }

    const secret = env.JWT_SECRET
    const token = await sign(payload, secret, "HS512")

    return c.json({token}, 201)
})

export default app