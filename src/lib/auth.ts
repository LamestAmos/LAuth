import { randomBytes, scrypt, timingSafeEqual } from "node:crypto"

function scryptAsync(password: string, salt: string) {
    return new Promise<Buffer>((resolve, reject) => {
        scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) {
                reject(err)
                return
            }
            resolve(derivedKey)
        })
    })    
}

export async function hashPassword(password: string) {
    const salt = randomBytes(16).toString("hex")
    const passwordHash = await scryptAsync(password, salt)
    return `${salt}:${passwordHash.toString("hex")}`
} 

export async function verifyPassword(password: string, passwordHash: string) {
    const [salt, hash] = passwordHash.split(":")
    const stored = Buffer.from(hash, "hex")
    const derived = await scryptAsync(password, salt)
    return timingSafeEqual(stored, derived)
}