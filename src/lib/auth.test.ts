import { expect, it, describe } from "vitest"
import { hashPassword, verifyPassword } from "./auth.ts"

const password = "password"
describe("Password Hashing", () => {
    it("hashes the password", async () => {
        const passwordHash = await hashPassword(password)

        expect(passwordHash).not.toBe(password)
        expect(passwordHash).toBeDefined()
    })
})

describe("Password Verification", () => {
    it("gives true for the same password", async () => {
        const passwordHash = await hashPassword(password)

        const verify = await verifyPassword(password, passwordHash)
        expect(verify).toBe(true)
    })
    
    it("gives false for the different password", async () => {
        const passwordHash = await hashPassword(password)

        const verify = await verifyPassword("mypassword", passwordHash)
        expect(verify).toBe(false)
    })
})