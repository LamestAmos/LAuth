import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { jwtMiddleware } from './middleware/jwt.ts'
import authRoutes from "./routes/auth.ts"

const app = new Hono()

app.use(logger())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route("/auth", authRoutes)

app.get("/hi", ...jwtMiddleware,  (c) => {
  const name = c.get("jwtPayload")?.name ?? "Guest"
  return c.text(`Hello ${name}!`)
})

export default app