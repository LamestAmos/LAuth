import { drizzle } from "drizzle-orm/node-sqlite";
import { env } from "../data/env.ts";

export const db = drizzle(env.DB_FILE)